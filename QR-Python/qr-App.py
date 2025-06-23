import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import qrcode
from PIL import Image, ImageTk
import re
import os
import base64
from io import BytesIO

class QRCodeGenerator:
    def __init__(self, root):
        self.root = root
        self.root.title("QR Code Generator")
        self.root.state('zoomed')  # Full screen on Windows
        # For Linux/Mac: self.root.attributes('-zoomed', True)
        
        # Color scheme
        self.bg_color = "#1a1a2e"
        self.secondary_bg = "#16213e"
        self.accent_color = "#0f3460"
        self.button_color = "#533483"
        self.button_hover = "#7209b7"
        self.text_color = "#ffffff"
        self.success_color = "#28a745"
        self.error_color = "#dc3545"
        
        self.root.configure(bg=self.bg_color)
        
        # Variables
        self.data_type = tk.StringVar(value="text")
        self.input_data = tk.StringVar()
        self.qr_image = None
        self.selected_image_path = ""
        
        self.setup_ui()
        
    def setup_ui(self):
        # Main container
        main_frame = tk.Frame(self.root, bg=self.bg_color)
        main_frame.pack(fill='both', expand=True, padx=40, pady=20)
        
        # Title
        title_label = tk.Label(
            main_frame, 
            text="QR Code Generator", 
            font=("Arial", 32, "bold"),
            fg=self.text_color,
            bg=self.bg_color
        )
        title_label.pack(pady=(0, 30))
        
        # Content frame
        content_frame = tk.Frame(main_frame, bg=self.bg_color)
        content_frame.pack(fill='both', expand=True)
        
        # Left panel for input
        left_panel = tk.Frame(content_frame, bg=self.secondary_bg, relief='ridge', bd=2)
        left_panel.pack(side='left', fill='both', expand=True, padx=(0, 20))
        
        # Data type selection
        type_frame = tk.Frame(left_panel, bg=self.secondary_bg)
        type_frame.pack(fill='x', padx=20, pady=20)
        
        tk.Label(
            type_frame, 
            text="Select Data Type:", 
            font=("Arial", 16, "bold"),
            fg=self.text_color,
            bg=self.secondary_bg
        ).pack(anchor='w', pady=(0, 10))
        
        # Radio buttons for data types
        types = [("Text", "text"), ("URL", "url"), ("Phone Number", "phone"), ("Image", "image")]
        
        for text, value in types:
            rb = tk.Radiobutton(
                type_frame,
                text=text,
                variable=self.data_type,
                value=value,
                font=("Arial", 12),
                fg=self.text_color,
                bg=self.secondary_bg,
                selectcolor=self.accent_color,
                activebackground=self.secondary_bg,
                activeforeground=self.text_color,
                command=self.on_type_change
            )
            rb.pack(anchor='w', pady=2)
        
        # Input frame
        input_frame = tk.Frame(left_panel, bg=self.secondary_bg)
        input_frame.pack(fill='both', expand=True, padx=20, pady=20)
        
        self.input_label = tk.Label(
            input_frame,
            text="Enter Text:",
            font=("Arial", 14, "bold"),
            fg=self.text_color,
            bg=self.secondary_bg
        )
        self.input_label.pack(anchor='w', pady=(0, 10))
        
        # Text input
        self.text_entry = tk.Text(
            input_frame,
            height=6,
            font=("Arial", 12),
            bg="#ffffff",
            fg="#000000",
            relief='flat',
            bd=5
        )
        self.text_entry.pack(fill='both', expand=True, pady=(0, 20))
        
        # Image selection frame (initially hidden)
        self.image_frame = tk.Frame(input_frame, bg=self.secondary_bg)
        
        self.select_image_btn = self.create_button(
            self.image_frame,
            "Select Image",
            self.select_image,
            width=15
        )
        self.select_image_btn.pack(pady=10)
        
        self.image_path_label = tk.Label(
            self.image_frame,
            text="No image selected",
            font=("Arial", 10),
            fg="#cccccc",
            bg=self.secondary_bg
        )
        self.image_path_label.pack(pady=5)
        
        # Generate button
        self.generate_btn = self.create_button(
            input_frame,
            "Generate QR Code",
            self.generate_qr,
            width=20
        )
        self.generate_btn.pack(pady=20)
        
        # Status label
        self.status_label = tk.Label(
            input_frame,
            text="Ready to generate QR code",
            font=("Arial", 10),
            fg=self.success_color,
            bg=self.secondary_bg
        )
        self.status_label.pack(pady=5)
        
        # Right panel for QR code display
        right_panel = tk.Frame(content_frame, bg=self.secondary_bg, relief='ridge', bd=2)
        right_panel.pack(side='right', fill='both', expand=True)
        
        # QR Code display area
        qr_frame = tk.Frame(right_panel, bg=self.secondary_bg)
        qr_frame.pack(fill='both', expand=True, padx=20, pady=20)
        
        tk.Label(
            qr_frame,
            text="Generated QR Code:",
            font=("Arial", 16, "bold"),
            fg=self.text_color,
            bg=self.secondary_bg
        ).pack(pady=(0, 20))
        
        # QR Code canvas
        self.qr_canvas = tk.Canvas(
            qr_frame,
            width=400,
            height=400,
            bg="#ffffff",
            relief='sunken',
            bd=3
        )
        self.qr_canvas.pack(pady=20)
        
        # Save button
        self.save_btn = self.create_button(
            qr_frame,
            "Save QR Code",
            self.save_qr,
            width=15
        )
        self.save_btn.pack(pady=20)
        self.save_btn.config(state='disabled')
        
    def create_button(self, parent, text, command, width=12):
        btn = tk.Button(
            parent,
            text=text,
            command=command,
            font=("Arial", 12, "bold"),
            bg=self.button_color,
            fg=self.text_color,
            relief='flat',
            bd=0,
            padx=20,
            pady=10,
            width=width,
            cursor='hand2'
        )
        
        # Hover effects
        def on_enter(e):
            btn.config(bg=self.button_hover)
        
        def on_leave(e):
            btn.config(bg=self.button_color)
            
        btn.bind("<Enter>", on_enter)
        btn.bind("<Leave>", on_leave)
        
        return btn
    
    def on_type_change(self):
        data_type = self.data_type.get()
        
        if data_type == "image":
            self.text_entry.pack_forget()
            self.image_frame.pack(fill='x', pady=(0, 20))
            self.input_label.config(text="Select Image:")
        else:
            self.image_frame.pack_forget()
            self.text_entry.pack(fill='both', expand=True, pady=(0, 20))
            
            if data_type == "text":
                self.input_label.config(text="Enter Text:")
                self.text_entry.delete(1.0, tk.END)
                self.text_entry.insert(1.0, "Enter your text here...")
            elif data_type == "url":
                self.input_label.config(text="Enter URL:")
                self.text_entry.delete(1.0, tk.END)
                self.text_entry.insert(1.0, "https://example.com")
            elif data_type == "phone":
                self.input_label.config(text="Enter Phone Number:")
                self.text_entry.delete(1.0, tk.END)
                self.text_entry.insert(1.0, "+1234567890")
    
    def select_image(self):
        file_path = filedialog.askopenfilename(
            title="Select Image",
            filetypes=[
                ("Image files", "*.png *.jpg *.jpeg *.gif *.bmp"),
                ("All files", "*.*")
            ]
        )
        
        if file_path:
            self.selected_image_path = file_path
            filename = os.path.basename(file_path)
            self.image_path_label.config(
                text=f"Selected: {filename}",
                fg=self.success_color
            )
        else:
            self.selected_image_path = ""
            self.image_path_label.config(
                text="No image selected",
                fg="#cccccc"
            )
    
    def validate_data(self, data, data_type):
        if not data.strip() and data_type != "image":
            return False, "Please enter some data"
        
        if data_type == "url":
            url_pattern = re.compile(
                r'^https?://'  # http:// or https://
                r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
                r'localhost|'  # localhost...
                r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
                r'(?::\d+)?'  # optional port
                r'(?:/?|[/?]\S+)$', re.IGNORECASE)
            
            if not url_pattern.match(data.strip()):
                return False, "Please enter a valid URL (must start with http:// or https://)"
        
        elif data_type == "phone":
            # Remove all non-digit characters except + for international numbers
            clean_phone = re.sub(r'[^\d+]', '', data)
            
            # Check if it's a valid phone number format
            if not re.match(r'^\+?[\d\s\-\(\)]{7,15}$', data) or len(clean_phone.replace('+', '')) < 7:
                return False, "Please enter a valid phone number (7-15 digits)"
        
        elif data_type == "image":
            if not self.selected_image_path or not os.path.exists(self.selected_image_path):
                return False, "Please select a valid image file"
        
        return True, "Valid data"
    
    def generate_qr(self):
        try:
            data_type = self.data_type.get()
            
            if data_type == "image":
                data = self.selected_image_path
            else:
                data = self.text_entry.get(1.0, tk.END).strip()
            
            # Validate data
            is_valid, message = self.validate_data(data, data_type)
            
            if not is_valid:
                self.status_label.config(text=message, fg=self.error_color)
                messagebox.showerror("Invalid Data", message)
                return
            
            # Prepare data for QR code
            if data_type == "phone":
                qr_data = f"tel:{data}"
            elif data_type == "image":
                # Convert image to base64
                with open(data, "rb") as img_file:
                    img_data = base64.b64encode(img_file.read()).decode('utf-8')
                    qr_data = f"data:image;base64,{img_data}"
            else:
                qr_data = data
            
            # Generate QR code
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            
            qr.add_data(qr_data)
            qr.make(fit=True)
            
            # Create QR code image
            self.qr_image = qr.make_image(fill_color="black", back_color="white")
            
            # Resize for display
            display_size = (350, 350)
            display_image = self.qr_image.resize(display_size, Image.Resampling.LANCZOS)
            
            # Convert to PhotoImage for tkinter
            self.qr_photo = ImageTk.PhotoImage(display_image)
            
            # Clear canvas and display QR code
            self.qr_canvas.delete("all")
            self.qr_canvas.create_image(200, 200, image=self.qr_photo)
            
            # Enable save button
            self.save_btn.config(state='normal')
            
            self.status_label.config(
                text=f"QR code generated successfully for {data_type}!",
                fg=self.success_color
            )
            
        except Exception as e:
            error_msg = f"Error generating QR code: {str(e)}"
            self.status_label.config(text=error_msg, fg=self.error_color)
            messagebox.showerror("Generation Error", error_msg)
    
    def save_qr(self):
        if self.qr_image:
            file_path = filedialog.asksaveasfilename(
                defaultextension=".png",
                filetypes=[("PNG files", "*.png"), ("All files", "*.*")],
                title="Save QR Code"
            )
            
            if file_path:
                try:
                    self.qr_image.save(file_path)
                    self.status_label.config(
                        text=f"QR code saved to {os.path.basename(file_path)}",
                        fg=self.success_color
                    )
                    messagebox.showinfo("Success", f"QR code saved successfully!")
                except Exception as e:
                    error_msg = f"Error saving file: {str(e)}"
                    self.status_label.config(text=error_msg, fg=self.error_color)
                    messagebox.showerror("Save Error", error_msg)

def main():
    root = tk.Tk()
    app = QRCodeGenerator(root)
    root.mainloop()

if __name__ == "__main__":
    main()
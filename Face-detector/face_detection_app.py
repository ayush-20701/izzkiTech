import cv2
import sys

def main():
    # Initialize the camera
    cap = cv2.VideoCapture(0)
    
    # Check if camera opened successfully
    if not cap.isOpened():
        print("Error: Could not open camera")
        return
    
    # Load multiple cascade classifiers for better accuracy
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    face_cascade_alt = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml')
    
    if face_cascade.empty() or face_cascade_alt.empty():
        print("Error: Could not load face cascade classifiers")
        cap.release()
        return
    
    print("Face Detection App Started!")
    print("Press 'q' to quit, 'ESC' to exit")
    
    while True:
        # Read frame from camera
        ret, frame = cap.read()
        
        if not ret:
            print("Error: Failed to capture frame")
            break
        
        # Convert frame to grayscale (face detection works better on grayscale)
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Apply histogram equalization to improve contrast
        gray = cv2.equalizeHist(gray)
        
        # Detect faces using primary classifier
        faces1 = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.05,  # Smaller scale factor for better accuracy
            minNeighbors=8,    # Higher threshold to reduce false positives
            minSize=(40, 40),  # Larger minimum size
            maxSize=(300, 300), # Maximum size to filter out large false positives
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        # Detect faces using alternative classifier
        faces2 = face_cascade_alt.detectMultiScale(
            gray,
            scaleFactor=1.05,
            minNeighbors=8,
            minSize=(40, 40),
            maxSize=(300, 300),
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        # Combine and filter overlapping detections
        all_faces = list(faces1) + list(faces2)
        faces = []
        
        for (x, y, w, h) in all_faces:
            # Calculate aspect ratio to filter out non-face rectangles
            aspect_ratio = w / h
            if 0.7 <= aspect_ratio <= 1.4:  # Faces are roughly square
                # Check if this face overlaps significantly with existing faces
                overlap = False
                for (fx, fy, fw, fh) in faces:
                    # Calculate overlap
                    overlap_x = max(0, min(x + w, fx + fw) - max(x, fx))
                    overlap_y = max(0, min(y + h, fy + fh) - max(y, fy))
                    overlap_area = overlap_x * overlap_y
                    face_area = w * h
                    
                    if overlap_area > 0.3 * face_area:  # 30% overlap threshold
                        overlap = True
                        break
                
                if not overlap:
                    faces.append((x, y, w, h))
        
        # Draw rectangles around detected faces
        for (x, y, w, h) in faces:
            # Draw green rectangle around face
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            # Optional: Add a label above each face
            cv2.putText(frame, 'Face', (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        
        # Display the count of faces detected
        face_count = len(faces)
        count_text = f"People detected: {face_count}"
        
        # Add background rectangle for better text visibility
        text_size = cv2.getTextSize(count_text, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
        cv2.rectangle(frame, (10, 10), (text_size[0] + 20, text_size[1] + 20), (0, 0, 0), -1)
        
        # Add the count text
        cv2.putText(frame, count_text, (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        
        # Display the frame
        cv2.imshow('Face Detection App', frame)
        
        # Handle key presses
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:  # 'q' key or ESC key
            break
    
    # Clean up
    cap.release()
    cv2.destroyAllWindows()
    print("Face Detection App Closed")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nApplication interrupted by user")
        cv2.destroyAllWindows()
    except Exception as e:
        print(f"An error occurred: {e}")
        cv2.destroyAllWindows()
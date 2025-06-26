import cv2
import sys

def main():
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Could not open camera")
        return
    
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    face_cascade_alt = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_alt.xml')
    
    if face_cascade.empty() or face_cascade_alt.empty():
        print("Error: Could not load face cascade classifiers")
        cap.release()
        return
    
    print("Face Detection App Started!")
    print("Press 'q' to quit, 'ESC' to exit")
    
    while True:
        ret, frame = cap.read()
        
        if not ret:
            print("Error: Failed to capture frame")
            break
        
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.equalizeHist(gray)
        
        faces1 = face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.05,
            minNeighbors=8,
            minSize=(40, 40),
            maxSize=(300, 300),
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        faces2 = face_cascade_alt.detectMultiScale(
            gray,
            scaleFactor=1.05,
            minNeighbors=8,
            minSize=(40, 40),
            maxSize=(300, 300),
            flags=cv2.CASCADE_SCALE_IMAGE
        )
        
        all_faces = list(faces1) + list(faces2)
        faces = []
        
        for (x, y, w, h) in all_faces:
            aspect_ratio = w / h
            if 0.7 <= aspect_ratio <= 1.4:
                overlap = False
                for (fx, fy, fw, fh) in faces:
                    overlap_x = max(0, min(x + w, fx + fw) - max(x, fx))
                    overlap_y = max(0, min(y + h, fy + fh) - max(y, fy))
                    overlap_area = overlap_x * overlap_y
                    face_area = w * h
                    
                    if overlap_area > 0.3 * face_area:
                        overlap = True
                        break
                
                if not overlap:
                    faces.append((x, y, w, h))
        
        for (x, y, w, h) in faces:
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            cv2.putText(frame, 'Face', (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        
        face_count = len(faces)
        count_text = f"People detected: {face_count}"
        text_size = cv2.getTextSize(count_text, cv2.FONT_HERSHEY_SIMPLEX, 0.8, 2)[0]
        cv2.rectangle(frame, (10, 10), (text_size[0] + 20, text_size[1] + 20), (0, 0, 0), -1)
        cv2.putText(frame, count_text, (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
        cv2.imshow('Face Detection App', frame)
        
        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == 27:
            break
    
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
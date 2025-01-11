import cv2
import numpy as np
from pyzbar.pyzbar import decode
from PIL import Image
import io
import pytesseract
import easyocr  # For handwritten OCR
import sys
import json  
# Initialize EasyOCR Reader
reader = easyocr.Reader(['en'])  # English language support


def detect_and_crop_barcode(image, margin_mm=2, dpi=300, min_width=100, min_height=50):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 50, 150)
    contours, _ = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    barcode_contour = None

    for contour in contours:
        epsilon = 0.02 * cv2.arcLength(contour, True)
        approx = cv2.approxPolyDP(contour, epsilon, True)
        if len(approx) == 4 and cv2.contourArea(contour) > 1000:
            barcode_contour = approx
            break

    if barcode_contour is not None:
        x, y, w, h = cv2.boundingRect(barcode_contour)

        if w < min_width or h < min_height:
            return None

        margin_pixels = int((margin_mm / 25.4) * dpi)
        x_new = max(0, x + margin_pixels)
        y_new = max(0, y + margin_pixels)
        w_new = max(1, w - 2 * margin_pixels)
        h_new = max(1, h - 2 * margin_pixels)

        cropped_barcode = image[y_new:y_new + h_new, x_new:x_new + w_new]
        if cropped_barcode.size == 0:
            return None

        return cropped_barcode

    return None


def extract_handwritten_digits(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    results = reader.readtext(gray, detail=0)
    digits = ''.join([res for res in results if res.isdigit()])
    return digits


def process_barcode_image(file_data):

    result_array = []

    image = Image.open(io.BytesIO(file_data))
    image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)

    # 1. Detect and decode barcode
    cropped_barcode = detect_and_crop_barcode(image_cv)
    if cropped_barcode is not None:
        barcodes = decode(Image.fromarray(cropped_barcode))
        if barcodes:
            result_array.extend([{"data_1": barcode.data.decode("utf-8"), "type": barcode.type} for barcode in barcodes])

    # 2. Decode without cropping
    barcodes = decode(image)
    if barcodes:
        result_array.extend([{"data_2": barcode.data.decode("utf-8"), "type": barcode.type} for barcode in barcodes])

    # 3. Extract handwritten digits
    digits = extract_handwritten_digits(image_cv)
    if digits:
        result_array.append({"data_3": digits})

    return result_array if result_array else {"message": "No barcode or digits detected"}

if __name__ == '__main__':
    # Reading the image data passed through stdin (from Node.js)
    file_data = sys.stdin.buffer.read()
    
    # Process the image
    result = process_barcode_image(file_data)
    
    # Print the result (This is sent back to Node.js)
    print(json.dumps(result))

  
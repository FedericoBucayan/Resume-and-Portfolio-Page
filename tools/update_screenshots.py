import fitz  # PyMuPDF
import os

# Get path of the script directory, then find assets folder in parent directory
script_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(script_dir)
assets_dir = os.path.join(project_root, "assets")

# Define local paths to the projects' PDF files
pdf_paths = {
    os.path.join(assets_dir, 'Retail_Performance_PBI.jpg'): r'C:\Users\bucay\OneDrive\Documents\Fede\AI Test\Retail\Retail_Performance_Dashboard_PBI_PDF.pdf',
    os.path.join(assets_dir, 'Demand_Planning_PBI.jpg'): r'C:\Users\bucay\OneDrive\Documents\Fede\AI Test\Demand Planning\Demand_Planning_Dashboard_PBI_PDF.pdf',
    os.path.join(assets_dir, 'Retail_Ecommerce_Analytics_PBI.jpg'): r'C:\Users\bucay\OneDrive\Documents\Fede\AI Test\DTC Project 1\Retail_Ecommerce_Analytics_PBI_PDF.pdf'
}

def update_screenshots():
    # Make sure assets folder exists
    os.makedirs(assets_dir, exist_ok=True)
    
    for img_path, pdf_path in pdf_paths.items():
        if os.path.exists(pdf_path):
            print(f"Opening PDF: {pdf_path}...")
            try:
                doc = fitz.open(pdf_path)
                page = doc.load_page(0)  # Load first page of the PDF
                
                # Render to high-quality image (DPI 150 gives sharp text and visuals)
                pix = page.get_pixmap(dpi=150)
                pix.save(img_path)
                print(f"Successfully generated screenshot: {os.path.basename(img_path)}")
                doc.close()
            except Exception as e:
                print(f"Failed to process {pdf_path}: {e}")
        else:
            print(f"Skipping: {pdf_path} does not exist at this location.")

if __name__ == '__main__':
    update_screenshots()
    print("Done!")

import os
import re
import shutil
import zipfile

# Paths
CATALOG_PATH = r"e:\my-project\brands\nhan-tam\docs\skill-catalog.md"
SKILLS_SOURCE = r"e:\my-project\.opencode\skills"
BASE_RELEASE = r"e:\my-project\release\manus-skills"
BUNDLES_DIR = r"e:\my-project\release\bundles"
MASTER_ZIP = r"e:\my-project\release\Manus_All_Skills_Master.zip"

def setup_dirs():
    if os.path.exists(BASE_RELEASE):
        shutil.rmtree(BASE_RELEASE)
    os.makedirs(BASE_RELEASE)
    if os.path.exists(BUNDLES_DIR):
        shutil.rmtree(BUNDLES_DIR)
    os.makedirs(BUNDLES_DIR)

def parse_catalog():
    categories = {
        "Marketing_Core": [],
        "Growth_Revenue": [],
        "Creative_Design": [],
        "Technical_Infrastructure": [],
        "Content_Production": [],
        "Process_Management": []
    }
    
    with open(CATALOG_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    current_cat = None
    lines = content.split('\n')
    for line in lines:
        cat_match = re.search(r"## (.*) Skills", line)
        if cat_match:
            name = cat_match.group(1).replace(" & ", "_").replace(" ", "_")
            if name in categories:
                current_cat = name
            else:
                current_cat = None
        
        skill_match = re.search(r"^\|\s*`([^`]+)`\s*\|", line)
        if skill_match and current_cat:
            categories[current_cat].append(skill_match.group(1))
            
    return categories

# Extensions to exclude to reduce size
EXCLUDE_EXTENSIONS = {'.mp4', '.mp3', '.png', '.jpg', '.jpeg', '.gif', '.zip', '.tar', '.gz', '.pdf'}
EXCLUDE_DIRS = {'node_modules', '.venv', '__pycache__', '.git', '.pytest_cache'}

def should_exclude(name, is_dir=False):
    if is_dir:
        return name in EXCLUDE_DIRS
    return any(name.lower().endswith(ext) for ext in EXCLUDE_EXTENSIONS)

def package_skills(categories):
    all_packaged = set()
    
    # Process categorized skills
    for cat, skills in categories.items():
        cat_path = os.path.join(BASE_RELEASE, cat)
        os.makedirs(cat_path, exist_ok=True)
        
        for skill in skills:
            src = os.path.join(SKILLS_SOURCE, skill)
            if os.path.exists(src):
                dest = os.path.join(cat_path, skill)
                copy_lean(src, dest)
                all_packaged.add(skill)
    
    # Process uncategorized skills
    uncat_path = os.path.join(BASE_RELEASE, "Uncategorized")
    os.makedirs(uncat_path, exist_ok=True)
    
    for item in os.listdir(SKILLS_SOURCE):
        src_item = os.path.join(SKILLS_SOURCE, item)
        if os.path.isdir(src_item) and item not in all_packaged:
            copy_lean(src_item, os.path.join(uncat_path, item))

def copy_lean(src, dest):
    """Custom copy that excludes heavy files and dirs"""
    if not os.path.exists(dest):
        os.makedirs(dest)
    
    for item in os.listdir(src):
        if should_exclude(item, os.path.isdir(os.path.join(src, item))):
            continue
            
        s = os.path.join(src, item)
        d = os.path.join(dest, item)
        
        if os.path.isdir(s):
            copy_lean(s, d)
        else:
            shutil.copy2(s, d)

def create_zips():
    # Zip each category bundle
    for cat in os.listdir(BASE_RELEASE):
        cat_path = os.path.join(BASE_RELEASE, cat)
        if os.path.isdir(cat_path):
            zip_path = os.path.join(BUNDLES_DIR, f"{cat}.zip")
            shutil.make_archive(zip_path.replace('.zip', ''), 'zip', cat_path)
            
    # Zip the Master collection
    shutil.make_archive(MASTER_ZIP.replace('.zip', ''), 'zip', BASE_RELEASE)

if __name__ == "__main__":
    setup_dirs()
    cats = parse_catalog()
    package_skills(cats)
    create_zips()
    print("Packaging complete!")

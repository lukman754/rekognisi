import streamlit as st
import os
import re
import json
from pathlib import Path
import shutil
from datetime import datetime

# Set page config
st.set_page_config(
    page_title="Folder Organizer",
    page_icon="📁",
    layout="wide"
)

# Initialize session state for storing path and expanded folder
if 'selected_directory' not in st.session_state:
    st.session_state.selected_directory = None
if 'expanded_folder' not in st.session_state:
    st.session_state.expanded_folder = None
if 'processed_folders' not in st.session_state:
    st.session_state.processed_folders = set()

# File icons dictionary
file_icons = {
    '.pdf': '📄',
    '.txt': '🔗',
    '.json': '📋',
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.gif': '🖼️',
    'default': '📁'
}

def get_file_icon(file_path):
    """Get appropriate icon for file type"""
    return file_icons.get(Path(file_path).suffix.lower(), file_icons['default'])

def extract_nim_text_date(filename):
    """Extract NIM, text, and date from filename"""
    match = re.search(r'(.*?)(\d{9,})_?(\d{1,2}\s*[A-Za-z]+\s*\d{4})', filename)
    if match:
        return match.group(1).strip(), match.group(2), match.group(3)
    return None, None, None

def process_folder(directory):
    """Process the selected folder to organize files"""
    directory = Path(directory)
    files = [f for f in directory.iterdir() if f.is_file()]
    
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    file_groups = {}
    for i, file in enumerate(files):
        text, nim, date = extract_nim_text_date(file.name)
        if text and nim and date:
            group_key = f"{text}_{nim}_{date}"
            file_groups.setdefault(group_key, []).append(file)
        progress = (i + 1) / len(files)
        progress_bar.progress(progress)
        status_text.text(f"Processing file {i+1} of {len(files)}")
    
    for group_key, group_files in file_groups.items():
        folder_path = directory / group_key
        folder_path.mkdir(exist_ok=True)
        for source_path in group_files:
            try:
                shutil.move(str(source_path), str(folder_path / source_path.name))
            except Exception as e:
                st.error(f"Error moving {source_path.name}: {e}")
    
    progress_bar.empty()
    status_text.empty()
    st.success("Folder processing completed!")

def mark_folder_done(folder_path):
    """Mark a folder as done by adding DONE_ prefix"""
    folder = Path(folder_path)
    if folder.name.startswith("DONE_"):
        new_name = folder.name[5:]
        st.session_state.processed_folders.discard(str(folder))
    else:
        new_name = "DONE_" + folder.name
        st.session_state.processed_folders.add(str(folder))
    
    try:
        new_path = folder.parent / new_name
        folder.rename(new_path)
        return True
    except Exception as e:
        st.error(f"Error marking folder: {e}")
        return False

def main():
    st.title("📁 Folder Organizer")
    
    # Sidebar for folder selection
    with st.sidebar:
        st.header("Folder Selection")
        folder_path = st.text_input(
            "Enter folder path:",
            value=st.session_state.selected_directory or "",
            placeholder="/path/to/your/folder"
        )
        
        if folder_path and Path(folder_path).exists():
            st.session_state.selected_directory = folder_path
        
        if st.button("Process Folder", type="primary"):
            if st.session_state.selected_directory:
                process_folder(st.session_state.selected_directory)
                st.rerun()
    
    # Main content
    if st.session_state.selected_directory:
        folder_path = Path(st.session_state.selected_directory)
        st.write(f"**Current Path:** {folder_path}")
        
        # Get folder statistics
        folders = [f for f in folder_path.iterdir() if f.is_dir()]
        done_count = sum(1 for f in folders if f.name.startswith("DONE_"))
        
        # Display statistics
        col1, col2, col3 = st.columns(3)
        with col1:
            st.metric("Total Folders", len(folders))
        with col2:
            st.metric("Done", done_count)
        with col3:
            st.metric("Pending", len(folders) - done_count)
        
        # Display folders
        for folder in sorted(folders, key=lambda x: x.name):
            with st.expander(
                f"{'✅' if folder.name.startswith('DONE_') else '📁'} {folder.name}",
                expanded=str(folder) == st.session_state.expanded_folder
            ):
                col1, col2 = st.columns([1, 8])
                with col1:
                    if st.button(
                        "Mark Done" if not folder.name.startswith("DONE_") else "Unmark Done",
                        key=f"btn_{folder.name}",
                        type="primary" if not folder.name.startswith("DONE_") else "secondary"
                    ):
                        if mark_folder_done(folder):
                            st.rerun()
                
                # Display files in folder
                files = sorted([f for f in folder.iterdir() if f.is_file()])
                if files:
                    for file in files:
                        st.text(f"{get_file_icon(file)} {file.name}")
                else:
                    st.info("No files in this folder")
    else:
        st.info("Please select a folder using the sidebar")

if __name__ == "__main__":
    main()

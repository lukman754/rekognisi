import os
import re
import json
import pyperclip
import win32com.client
from pathlib import Path
import customtkinter as ctk
from tkinter import filedialog
from typing import Optional

class FolderOrganizerGUI(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        # Window setup
        self.title("Folder Organizer")
        self.geometry("700x600")
        
        # Set theme
        ctk.set_appearance_mode("dark")
        
        # Colors
        self.button_color = "#00C2CB"  # Cyan for main buttons
        self.done_color = "#2CC985"    # Green for done items
        self.pending_color = "#505050"  # Dark gray for pending items
        
        # File icons dictionary
        self.file_icons = {
            '.pdf': '📄',
            '.txt': '🔗',
            '.json': '📋',
            '.png': '🖼️',
            '.jpg': '🖼️',
            '.jpeg': '🖼️',
            '.gif': '🖼️',
            'default': '📁'
        }
        
        # Top buttons frame
        self.button_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.button_frame.pack(fill="x", padx=20, pady=(20,0))
        
        # Select folder button
        self.select_btn = ctk.CTkButton(
            self.button_frame,
            text="Select Folder",
            font=("Segoe UI", 13),
            height=40,
            fg_color=self.button_color,
            corner_radius=20,
            command=self.browse_folder
        )
        self.select_btn.pack(side="left", padx=(0,10))
        
        # Process button
        self.process_btn = ctk.CTkButton(
            self.button_frame,
            text="Proses Folder",
            font=("Segoe UI", 13),
            height=40,
            fg_color="#FFA559",  # Orange color
            corner_radius=20,
            command=self.process_folder
        )
        self.process_btn.pack(side="left", padx=(0,10))
        
        # Refresh button
        self.refresh_btn = ctk.CTkButton(
            self.button_frame,
            text="🔄 Refresh",
            font=("Segoe UI", 13),
            height=40,
            fg_color="#4B89DC",  # Blue color
            corner_radius=20,
            command=self.refresh_folder
        )
        self.refresh_btn.pack(side="left")
        
        # Path frame
        self.path_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.path_frame.pack(fill="x", padx=20, pady=(5,0))
        
        # PATH text label
        self.path_text = ctk.CTkLabel(
            self.path_frame,
            text="PATH",
            font=("Segoe UI", 12),
            anchor="w"
        )
        self.path_text.pack(fill="x")
        
        # Selected folder path label
        self.folder_label = ctk.CTkLabel(
            self.path_frame,
            text="No folder selected",
            font=("Segoe UI", 12),
            anchor="w",
            wraplength=660,
            justify="left"
        )
        self.folder_label.pack(fill="x")
        
        # Statistics label
        self.stats_label = ctk.CTkLabel(
            self,
            text="Total Folders: 0 | Done: 0 | Pending: 0",
            font=("Segoe UI", 14)
        )
        self.stats_label.pack(pady=10)
        
        # Progress bar
        self.progress_bar = ctk.CTkProgressBar(self)
        self.progress_bar.set(0)
        self.progress_bar.pack_forget()
        
        # Create scrollable frame for folder list
        self.scroll_frame = ctk.CTkScrollableFrame(
            self,
            width=600,
            height=300
        )
        self.scroll_frame.pack(fill="both", expand=True, padx=20, pady=(0,20))
        
        self.folder_frames = {}  # Store folder frames
        self.selected_directory: Optional[str] = None
        self.expanded_folder = None

    def refresh_folder(self):
        """Refresh the current folder view"""
        if self.selected_directory:
            self.update_folder_list()
            
            # Flash effect on refresh button
            original_color = self.refresh_btn.cget("fg_color")
            self.refresh_btn.configure(fg_color="#2CC985")  # Change to green briefly
            self.after(200, lambda: self.refresh_btn.configure(fg_color=original_color))
            
            # Show brief status message in stats label
            original_text = self.stats_label.cget("text")
            self.stats_label.configure(text="Refreshing folder contents...")
            self.after(1000, lambda: self.stats_label.configure(text=original_text))

        
    def get_file_icon(self, file_path):
        """Get appropriate icon for file type"""
        return self.file_icons.get(file_path.suffix.lower(), self.file_icons['default'])
        
    def create_file_button(self, parent, file_path):
        """Create a button for a file with improved long filename handling"""
        # Create main container frame
        frame = ctk.CTkFrame(parent, fg_color="transparent")
        frame.pack(fill="x", pady=1, padx=2)
        
        # Get icon and create display text
        icon = self.get_file_icon(file_path)
        display_text = f"{icon} {file_path.name}"
        
        # Create label with improved settings for long text
        label = ctk.CTkLabel(
            frame,
            text=display_text,
            anchor="w",
            justify="left",
            wraplength=520,  # Reduced to account for scrollbar and padding
            cursor="hand2",
            font=("Segoe UI", 12)  # Explicitly set font size
        )
        label.pack(fill="x", expand=True, padx=5, pady=2)
        
        # Bind click event
        label.bind("<Button-1>", lambda e, p=file_path: self.handle_file_click(p))
        
        # Hover effect
        def on_enter(e):
            frame.configure(fg_color=("gray75", "gray30"))
        
        def on_leave(e):
            frame.configure(fg_color="transparent")
        
        frame.bind("<Enter>", on_enter)
        frame.bind("<Leave>", on_leave)
        label.bind("<Enter>", on_enter)
        label.bind("<Leave>", on_leave)
        
        return frame
    
    def create_folder_frame(self, folder_name, folder_path):
        """Create folder frame with improved text handling"""
        # Main frame for folder
        frame = ctk.CTkFrame(self.scroll_frame, fg_color=self.pending_color)
        frame.pack(fill="x", pady=2, padx=5)
        
        # Header frame
        header = ctk.CTkFrame(frame, fg_color="transparent")
        header.pack(fill="x", padx=5, pady=2)
        
        # Done button
        done_btn = ctk.CTkButton(
            header,
            text="DONE",
            width=60,
            height=25,
            fg_color=self.button_color,
            command=lambda: self.mark_folder(folder_name, frame, done_btn)
        )
        done_btn.pack(side="left", padx=(5,10))
        
        # Folder name label with improved text handling
        name_label = ctk.CTkLabel(
            header,
            text=folder_name,
            font=("Segoe UI", 12),
            anchor="w",
            justify="left",
            wraplength=520  # Adjusted for better display
        )
        name_label.pack(side="left", fill="x", expand=True, padx=(0, 5))
        
        # Container for file list (initially hidden)
        files_frame = ctk.CTkFrame(frame, fg_color="transparent")
        
        def toggle_files(event=None):
            if files_frame.winfo_manager():
                files_frame.pack_forget()
                self.expanded_folder = None
            else:
                if self.expanded_folder:
                    self.expanded_folder.pack_forget()
                files_frame.pack(fill="x", padx=5, pady=5)
                self.expanded_folder = files_frame
                self.update_file_list(folder_path, files_frame)
        
        # Bind click events
        header.bind("<Button-1>", toggle_files)
        name_label.bind("<Button-1>", toggle_files)
        
        # Update color if folder is marked as done
        if folder_name.startswith("DONE_"):
            frame.configure(fg_color=self.done_color)
            done_btn.configure(fg_color="gray30", text="DONE")
        
        return frame
    
    # Rest of the methods remain the same
    def update_file_list(self, folder_path, files_frame):
        """Update file list with improved file display"""
        # Clear existing files
        for widget in files_frame.winfo_children():
            widget.destroy()
        
        try:
            # Create a container frame for better organization
            container = ctk.CTkFrame(files_frame, fg_color="transparent")
            container.pack(fill="x", expand=True, padx=5)
            
            # List and sort files
            files = sorted(Path(folder_path).iterdir(), key=lambda x: x.name.lower())
            
            # Create file buttons
            for file_path in files:
                if file_path.is_file():
                    self.create_file_button(container, file_path)
                    
        except Exception as e:
            print(f"Error listing files in {folder_path}: {e}")

    def handle_file_click(self, file_path):
        suffix = file_path.suffix.lower()
        if suffix in ['.pdf', '.png', '.jpg', '.jpeg', '.gif']:
            # Copy path for PDF and image files
            pyperclip.copy(str(file_path))
        elif suffix in ['.txt', '.json']:
            try:
                # Read and copy file content
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if suffix == '.json':
                        # Pretty print JSON
                        content = json.dumps(json.loads(content), indent=2)
                    pyperclip.copy(content)
            except Exception as e:
                print(f"Error reading file {file_path}: {e}")
                
    def browse_folder(self):
        directory = filedialog.askdirectory()
        if directory:
            self.selected_directory = directory
            self.folder_label.configure(text=directory)
            self.update_folder_list()
            
    def mark_folder(self, folder_name, frame, done_btn):
        if not self.selected_directory:
            return
            
        folder_path = Path(self.selected_directory) / folder_name.lstrip("DONE_")
        
        if folder_name.startswith("DONE_"):
            new_folder_name = folder_name.lstrip("DONE_")
            frame.configure(fg_color=self.pending_color)
            done_btn.configure(fg_color=self.button_color, text="DONE")
        else:
            new_folder_name = "DONE_" + folder_name
            frame.configure(fg_color=self.done_color)
            done_btn.configure(fg_color="gray30", text="DONE")
            
        new_folder_path = folder_path.parent / new_folder_name
        
        try:
            folder_path.rename(new_folder_path)
            # Update folder name in frame
            for widget in frame.winfo_children()[0].winfo_children():
                if isinstance(widget, ctk.CTkLabel):
                    widget.configure(text=new_folder_name)
        except Exception as e:
            print(f"Error renaming {folder_name}: {e}")
            
        self.update_stats()
        
    def update_folder_list(self):
        # Clear existing frames
        for frame in self.folder_frames.values():
            frame.destroy()
        self.folder_frames.clear()
        
        if not self.selected_directory:
            return
            
        folder_path = Path(self.selected_directory)
        folders = [f for f in folder_path.iterdir() if f.is_dir()]
        
        for folder in folders:
            frame = self.create_folder_frame(folder.name, folder)
            self.folder_frames[folder.name] = frame
            
        self.update_stats()
        
    def update_stats(self):
        done_count = sum(1 for name in self.folder_frames.keys() if name.startswith("DONE_"))
        total = len(self.folder_frames)
        self.stats_label.configure(
            text=f"Total Folders: {total} | Done: {done_count} | "
                f"Pending: {total - done_count}"
        )
        
    def process_folder(self):
        if not self.selected_directory:
            return
            
        shell = win32com.client.Dispatch("Shell.Application")
        directory = Path(self.selected_directory)
        files = [f for f in directory.iterdir() if f.is_file()]
        
        # Show and setup progress bar
        self.progress_bar.pack(pady=10, fill="x", padx=20)
        total_files = len(files)
        
        file_groups = {}
        for i, file in enumerate(files):
            text, nim, date = self.extract_nim_text_date(file.name)
            if text and nim and date:
                group_key = f"{text}_{nim}_{date}"
                file_groups.setdefault(group_key, []).append(file)
            self.progress_bar.set((i + 1) / total_files)
            self.update()
            
        for group_key, group_files in file_groups.items():
            folder_path = directory / group_key
            folder_path.mkdir(exist_ok=True)
            for source_path in group_files:
                try:
                    source_folder = shell.Namespace(str(source_path.parent))
                    dest_folder = shell.Namespace(str(folder_path))
                    source_item = source_folder.ParseName(source_path.name)
                    dest_folder.MoveHere(source_item)
                except Exception as e:
                    print(f"Error moving {source_path.name}: {e}")
        
        # Hide progress bar and update list
        self.progress_bar.pack_forget()
        self.update_folder_list()
        
    def extract_nim_text_date(self, filename):
        match = re.search(r'(.*?)(\d{9,})_?(\d{1,2}\s*[A-Za-z]+\s*\d{4})', filename)
        if match:
            return match.group(1).strip(), match.group(2), match.group(3)
        return None, None, None

if __name__ == "__main__":
    app = FolderOrganizerGUI()
    app.mainloop()
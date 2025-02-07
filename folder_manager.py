import os
import re
import json
import pyperclip
import win32com.client
from pathlib import Path
import customtkinter as ctk
from tkinter import filedialog
from typing import Optional, Dict
from collections import defaultdict
import threading
import pyautogui
import pygetwindow as gw
import time


class FolderOrganizerGUI(ctk.CTk):
    def __init__(self):
        super().__init__()
        
        # Window setup
        self.title("Folder Organizer")
        self.geometry("700x600")
        
        # Set theme
        ctk.set_appearance_mode("dark")
        
        # Colors
        self.button_color = "#00aee3"
        self.done_color = "#2CC985"
        self.pending_color = "#505050"
        self.table_bg = "#2B2B2B"
        self.header_bg = "#1E1E1E"
        
        # Auto input file variables
        self.running = False
        self.auto_input_thread = None
        
        # Cache file path
        self.cache_file = Path.home() / ".folder_organizer_cache.json"
        
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

        # Create main scrollable container
        self.main_container = ctk.CTkScrollableFrame(self)
        self.main_container.pack(fill="both", expand=True)
        
        # Create main frames
        self.create_top_frame()
        self.create_path_frame()
        self.create_stats_frame()
        self.create_auto_input_frame()  # New auto input frame
        self.create_table_frame()
        self.create_folder_list_frame()
        
        # Create notification label
        self.notification_label = ctk.CTkLabel(
            self.main_container,
            text="",
            font=("Segoe UI", 12),
            text_color="#2CC985"
        )
        self.notification_label.pack(pady=5)

        # Create progress bar
        self.progress_bar = ctk.CTkProgressBar(self.main_container)
        self.progress_bar.set(0)
        self.progress_bar.pack_forget()
        
        # Other initializations...
        self.folder_frames = {}
        self.selected_directory: Optional[str] = None
        self.expanded_folder = None
        self.show_table = False
        
        # Load cached path on startup
        self.load_cached_path()

    def create_auto_input_frame(self):
        """Create frame for auto input file controls"""
        self.auto_input_frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.auto_input_frame.pack(fill="x", padx=25, pady=5)
        
        self.auto_input_status = ctk.CTkLabel(
            self.auto_input_frame,
            text="Auto Input: Inactive ⛔",
            font=("Segoe UI", 12)
        )
        self.auto_input_status.pack(side="left")
        
        self.auto_input_btn = ctk.CTkButton(
            self.auto_input_frame,
            text="Start Auto Input ▶",
            width=120,
            height=30,
            fg_color="#2CC985",
            command=self.toggle_auto_input
        )
        self.auto_input_btn.pack(side="right")

    def detect_file_dialog(self):
        """Auto input file dialog detection thread"""
        while self.running:
            windows = gw.getWindowsWithTitle("Open")
            if windows:
                self.auto_input_status.configure(text="Auto Input: Dialog Detected! 📂")
                time.sleep(1)
                pyautogui.hotkey("ctrl", "v")
                pyautogui.press("enter")
                self.auto_input_status.configure(text="Auto Input: File Selected ✅")
                time.sleep(1)
            else:
                self.auto_input_status.configure(text="Auto Input: Waiting... ⏳")
            time.sleep(0.5)

    def toggle_auto_input(self):
        """Toggle auto input file detection"""
        self.running = not self.running
        if self.running:
            self.auto_input_btn.configure(
                text="Stop Auto Input ❌",
                fg_color="red"
            )
            self.auto_input_thread = threading.Thread(
                target=self.detect_file_dialog,
                daemon=True
            )
            self.auto_input_thread.start()
        else:
            self.auto_input_btn.configure(
                text="Start Auto Input ▶",
                fg_color="#2CC985"
            )
            self.auto_input_status.configure(text="Auto Input: Inactive ⛔")

    def mark_folder(self, folder_name, frame, done_btn):
        """Mark folder as done/undone with auto refresh"""
        if not self.selected_directory:
            return
            
        folder_path = Path(self.selected_directory) / folder_name.lstrip("ZZZ_DONE_")
        
        if folder_name.startswith("ZZZ_DONE_"):
            new_folder_name = folder_name.lstrip("ZZZ_DONE_")
            frame.configure(fg_color=self.pending_color)
            done_btn.configure(fg_color=self.button_color, text="DONE")
            done_btn.pack(side="left", padx=(5,10))
        else:
            new_folder_name = "ZZZ_DONE_" + folder_name
            frame.configure(fg_color=self.done_color)
            done_btn.configure(fg_color="gray30", text="DONE")
            done_btn.pack_forget()
            
        new_folder_path = folder_path.parent / new_folder_name
        
        try:
            folder_path.rename(new_folder_path)
            # Auto refresh after marking done
            self.after(100, self.refresh_folder)
        except Exception as e:
            print(f"Error renaming {folder_name}: {e}")

    def create_top_frame(self):
        """Create top buttons frame"""
        self.button_frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.button_frame.pack(fill="x", padx=20, pady=(20,0))
        
        self.select_btn = ctk.CTkButton(
            self.button_frame,
            text="📁 Select Folder",
            font=("Segoe UI", 13),
            height=40,
            fg_color=self.button_color,
            corner_radius=20,
            command=self.browse_folder
        )
        self.select_btn.pack(side="left", padx=(0,10))
        
        self.process_btn = ctk.CTkButton(
            self.button_frame,
            text="📂 Grouping File",
            font=("Segoe UI", 13),
            height=40,
            fg_color="#c46500",
            corner_radius=20,
            command=self.process_folder
        )
        self.process_btn.pack(side="left", padx=(0,10))
        
        self.refresh_btn = ctk.CTkButton(
            self.button_frame,
            text="🔄 Refresh",
            font=("Segoe UI", 13),
            height=40,
            fg_color="#4B89DC",
            corner_radius=20,
            command=self.refresh_folder
        )
        self.refresh_btn.pack(side="left")

    def create_path_frame(self):
        """Create path display frame"""
        self.path_frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.path_frame.pack(fill="x", padx=20, pady=(5,0))
        
        self.path_text = ctk.CTkLabel(
            self.path_frame,
            text="PATH",
            font=("Segoe UI", 12),
            anchor="w"
        )
        self.path_text.pack(fill="x")
        
        self.folder_label = ctk.CTkLabel(
            self.path_frame,
            text="No folder selected",
            font=("Segoe UI", 12),
            anchor="w",
            wraplength=660,
            justify="left"
        )
        self.folder_label.pack(fill="x")

    def create_stats_frame(self):
        """Create statistics frame"""
        self.stats_frame = ctk.CTkFrame(self.main_container, fg_color="transparent")
        self.stats_frame.pack(fill="x", padx=20, pady=5)
        
        self.stats_label = ctk.CTkLabel(
            self.stats_frame,
            text="Total Folders: 0 | Done: 0 | Pending: 0",
            font=("Segoe UI", 14)
        )
        self.stats_label.pack(side="left")
        
        self.toggle_table_btn = ctk.CTkButton(
            self.stats_frame,
            text="📊 Show Table",
            width=100,
            height=30,
            fg_color=self.button_color,
            command=self.toggle_table
        )
        self.toggle_table_btn.pack(side="right", padx=5)
        
        self.export_csv_btn = ctk.CTkButton(
            self.stats_frame,
            text="📄 Copy as CSV",
            width=100,
            height=30,
            fg_color=self.button_color,
            command=self.export_csv
        )
        self.export_csv_btn.pack(side="right", padx=5)

    def create_table_frame(self):
        """Create category table frame"""
        self.table_frame = ctk.CTkFrame(self.main_container, fg_color=self.table_bg)
        
        headers = ["Kategori", "Jumlah", "Done", "Pending"]
        for i, header in enumerate(headers):
            label = ctk.CTkLabel(
                self.table_frame,
                text=header,
                font=("Segoe UI", 12, "bold"),
                fg_color=self.header_bg,
                corner_radius=6
            )
            label.grid(row=0, column=i, padx=5, pady=5, sticky="ew")
        
        self.table_frame.grid_columnconfigure(0, weight=3)
        self.table_frame.grid_columnconfigure(1, weight=1)
        self.table_frame.grid_columnconfigure(2, weight=1)
        self.table_frame.grid_columnconfigure(3, weight=1)

    def create_folder_list_frame(self):
        """Create scrollable frame for folder list"""
        self.scroll_frame = ctk.CTkScrollableFrame(
            self.main_container,
            width=600,
            height=200
        )
        self.scroll_frame.pack(fill="both", expand=True, padx=20, pady=(0,10))

    def show_notification(self, message, duration=2000):
        """Show a temporary notification message"""
        self.notification_label.configure(text=message)
        self.after(duration, lambda: self.notification_label.configure(text=""))

    def save_path_to_cache(self):
        """Save the current path to cache file"""
        if self.selected_directory:
            try:
                cache_data = {"last_path": self.selected_directory}
                with open(self.cache_file, 'w') as f:
                    json.dump(cache_data, f)
            except Exception as e:
                print(f"Error saving cache: {e}")

    def load_cached_path(self):
        """Load the last used path from cache file"""
        try:
            if self.cache_file.exists():
                with open(self.cache_file, 'r') as f:
                    cache_data = json.load(f)
                    last_path = cache_data.get("last_path")
                    if last_path and Path(last_path).exists():
                        self.selected_directory = last_path
                        self.folder_label.configure(text=last_path)
                        self.update_folder_list()
        except Exception as e:
            print(f"Error loading cache: {e}")

    def toggle_table(self):
        """Toggle table visibility"""
        self.show_table = not self.show_table
        if self.show_table:
            self.table_frame.pack(fill="x", padx=20, pady=5)
            self.update_table()
        else:
            self.table_frame.pack_forget()

    def update_table(self):
        """Update table with current folder categories"""
        # Clear existing rows
        for widget in self.table_frame.grid_slaves():
            if int(widget.grid_info()["row"]) > 0:
                widget.destroy()
        
        if not self.selected_directory:
            return
        
        categories = defaultdict(lambda: {"total": 0, "done": 0, "pending": 0})
        
        for folder_name in self.folder_frames.keys():
            category = re.split(r'__\d{9,}', folder_name)[0].strip()
            if category.startswith("ZZZ_DONE_"):
                category = category[5:]
                categories[category]["done"] += 1
            else:
                categories[category]["pending"] += 1
            categories[category]["total"] += 1
        
        for i, (category, stats) in enumerate(sorted(categories.items()), 1):
            ctk.CTkLabel(
                self.table_frame,
                text=category,
                font=("Segoe UI", 12),
                anchor="w"
            ).grid(row=i, column=0, padx=5, pady=2, sticky="w")
            
            ctk.CTkLabel(
                self.table_frame,
                text=str(stats["total"]),
                font=("Segoe UI", 12)
            ).grid(row=i, column=1, padx=5, pady=2)
            
            ctk.CTkLabel(
                self.table_frame,
                text=str(stats["done"]),
                font=("Segoe UI", 12)
            ).grid(row=i, column=2, padx=5, pady=2)
            
            ctk.CTkLabel(
                self.table_frame,
                text=str(stats["pending"]),
                font=("Segoe UI", 12)
            ).grid(row=i, column=3, padx=5, pady=2)

    def export_csv(self):
        """Export table data as CSV"""
        if not self.selected_directory:
            return
        
        categories = defaultdict(lambda: {"total": 0, "done": 0, "pending": 0})
        for folder_name in self.folder_frames.keys():
            category = re.split(r'__\d{9,}', folder_name)[0].strip()
            if category.startswith("ZZZ_DONE_"):
                category = category[5:]
                categories[category]["done"] += 1
            else:
                categories[category]["pending"] += 1
            categories[category]["total"] += 1
        
        csv_content = "Kategori,Jumlah,Done,Pending\n"
        for category, stats in sorted(categories.items()):
            csv_content += f"{category},{stats['total']},{stats['done']},{stats['pending']}\n"
        
        pyperclip.copy(csv_content)
        self.show_notification("Table data copied as CSV")

    def get_file_icon(self, file_path):
        """Get appropriate icon for file type"""
        return self.file_icons.get(file_path.suffix.lower(), self.file_icons['default'])

    def create_file_button(self, parent, file_path):
        """Create a button for a file with improved long filename handling"""
        frame = ctk.CTkFrame(parent, fg_color="transparent")
        frame.pack(fill="x", pady=1, padx=2)
        
        icon = self.get_file_icon(file_path)
        display_text = f"{icon} {file_path.name}"
        
        label = ctk.CTkLabel(
            frame,
            text=display_text,
            anchor="w",
            justify="left",
            wraplength=520,
            cursor="hand2",
            font=("Segoe UI", 12)
        )
        label.pack(fill="x", expand=True, padx=5, pady=2)
        
        label.bind("<Button-1>", lambda e, p=file_path: self.handle_file_click(p))
        
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
        frame = ctk.CTkFrame(self.scroll_frame, fg_color=self.pending_color)
        frame.pack(fill="x", pady=2, padx=5)
        
        header = ctk.CTkFrame(frame, fg_color="transparent")
        header.pack(fill="x", padx=5, pady=2)
        
        done_btn = ctk.CTkButton(
            header,
            text="DONE",
            width=60,
            height=25,
            fg_color=self.button_color,
            command=lambda: self.mark_folder(folder_name, frame, done_btn)
        )
        done_btn.pack(side="left", padx=(5,10))
        
        name_label = ctk.CTkLabel(
            header,
            text=folder_name,
            font=("Segoe UI", 12),
            anchor="w",
            justify="left",
            wraplength=520
        )
        name_label.pack(side="left", fill="x", expand=True, padx=(0, 5))
        
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
        
        header.bind("<Button-1>", toggle_files)
        name_label.bind("<Button-1>", toggle_files)
        
        if folder_name.startswith("ZZZ_DONE_"):
            frame.configure(fg_color=self.done_color)
            done_btn.configure(fg_color="gray30", text="DONE")
            done_btn.pack_forget()
        else:
            done_btn.pack(side="left", padx=(5,10))
        
        return frame

    def update_file_list(self, folder_path, files_frame):
        """Update file list with improved file display"""
        # Clear existing files
        for widget in files_frame.winfo_children():
            widget.destroy()
        
        try:
            container = ctk.CTkFrame(files_frame, fg_color="transparent")
            container.pack(fill="x", expand=True, padx=5)
            
            files = sorted(Path(folder_path).iterdir(), key=lambda x: x.name.lower())
            
            for file_path in files:
                if file_path.is_file():
                    self.create_file_button(container, file_path)
                    
        except Exception as e:
            print(f"Error listing files in {folder_path}: {e}")

    def handle_file_click(self, file_path):
        """Handle file click events"""
        suffix = file_path.suffix.lower()
        try:
            if suffix in ['.pdf', '.png', '.jpg', '.jpeg', '.gif']:
                pyperclip.copy(str(file_path))
                self.show_notification(f"File path copied: {file_path.name}")
            elif suffix in ['.txt', '.json']:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    if suffix == '.txt':
                        pyperclip.copy(content)
                        self.show_notification(f"File content copied: {file_path.name}")
                    elif suffix == '.json':
                        json_content = json.loads(content)
                        pyperclip.copy(json.dumps(json_content, indent=4))
                        self.show_notification(f"JSON content copied: {file_path.name}")
        except Exception as e:
            print(f"Error handling file {file_path}: {e}")
            
    def browse_folder(self):
        """Browse and select folder"""
        directory = filedialog.askdirectory()
        if directory:
            self.selected_directory = directory
            self.folder_label.configure(text=directory)
            self.save_path_to_cache()
            self.update_folder_list()
                
    def refresh_folder(self):
        """Refresh the current folder view"""
        if self.selected_directory:
            self.update_folder_list()
            
            original_color = self.refresh_btn.cget("fg_color")
            self.refresh_btn.configure(fg_color="#2CC985")
            self.after(200, lambda: self.refresh_btn.configure(fg_color=original_color))
            
            original_text = self.stats_label.cget("text")
            self.stats_label.configure(text="Refreshing folder contents...")
            self.after(1000, lambda: self.stats_label.configure(text=original_text))
        
    def update_folder_list(self):
        """Update the folder list display"""
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
        if self.show_table:
            self.update_table()
        
    def update_stats(self):
        """Update statistics display"""
        done_count = sum(1 for name in self.folder_frames.keys() if name.startswith("ZZZ_DONE_"))
        total = len(self.folder_frames)
        self.stats_label.configure(
            text=f"Total Folders: {total} | Done: {done_count} | "
                f"Pending: {total - done_count}"
        )
        
    def process_folder(self):
        """Process folders and organize files"""
        if not self.selected_directory:
            return
            
        shell = win32com.client.Dispatch("Shell.Application")
        directory = Path(self.selected_directory)
        files = [f for f in directory.iterdir() if f.is_file()]
        
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
        
        self.progress_bar.pack_forget()
        self.update_folder_list()
        
    def extract_nim_text_date(self, filename):
        """Extract text, NIM, and date from filename"""
        match = re.search(r'(.*?)(\d{9,})_?(\d{1,2}\s*[A-Za-z]+\s*\d{4})', filename)
        if match:
            return match.group(1).strip(), match.group(2), match.group(3)
        return None, None, None

if __name__ == "__main__":
    app = FolderOrganizerGUI()
    app.mainloop()

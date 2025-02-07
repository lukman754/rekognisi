{
  "manifest_version": 3,
  "name": "Rekognisi Extractor",
  "version": "1.0",
  "description": "Run JavaScript files in browser console",
  "permissions": ["scripting", "activeTab"],
  "content_scripts": [
    {
      "matches": [
        "http://simkatmawa.kemdikbud.go.id/v5/kegiatan_mhs/non_lomba/*"
      ],
      "js": ["hide_form.js", "json_input.js", "style.js"],
      "run_at": "document_idle"
    },
    {
      "matches": ["https://sispema.unpam.ac.id/*"],
      "js": ["blob_download.js"],
      "run_at": "document_idle"
    }
  ],

  "action": {
    "default_title": "Console Runner"
  },
  "web_accessible_resources": [
    {
      "resources": ["sispema.js"],
      "matches": ["<all_urls>"]
    }
  ]
}

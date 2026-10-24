import json
import pathlib
from urllib.parse import quote

root = pathlib.Path(__file__).parent
files = sorted(p.name for p in (root / "loops").glob("*.mp3"))

catalog = {"loops": [{"file": "loops/" + quote(name)} for name in files]}

(root / "catalog.js").write_text(
    "window.CATALOG = " + json.dumps(catalog, indent=2) + ";\n",
    encoding="utf-8",
)
print(len(files), "loops")
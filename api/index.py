import sys
from pathlib import Path

# Ensure project root is in sys.path so Vercel finds main.py and data/
ROOT_DIR = Path(__file__).resolve().parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from main import app

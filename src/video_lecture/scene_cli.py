from __future__ import annotations

import argparse
import json
import os
from .scene_compose import compose_from_json


def main():
    p = argparse.ArgumentParser(description="Compose per-scene avatar + slides into a single video")
    p.add_argument("scenes_json", help="Path to scenes JSON file")
    p.add_argument("--output", "-o", required=True, help="Output MP4 path")
    args = p.parse_args()

    out = compose_from_json(args.scenes_json, args.output)
    print(f"Video saved to: {out}")


if __name__ == "__main__":
    main()

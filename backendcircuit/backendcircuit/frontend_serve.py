"""One-server hosting: Django serves the built React frontend (SPA) as well.

Build the frontend, copy its ``dist`` output into ``FRONTEND_DIST_DIR``
(default ``backendcircuit/frontend_dist``), and this view serves:

  * real files (``/assets/...``, ``/favicon.ico``, ``/robots.txt``) directly
  * every other path as ``index.html`` so client-side routing works

``/admin``, ``/api``, ``/media`` and ``/static`` are matched earlier in
``urlpatterns`` and never reach this view.
"""
from __future__ import annotations

import os

from django.conf import settings
from django.http import FileResponse, Http404
from django.views.static import serve as static_serve

_INDEX = "index.html"
_PREFIXES = ("api/", "admin/", "media/", "static/")


def frontend(request, path: str = ""):
    if not path or path.startswith(_PREFIXES) or ".." in path.replace("\\", "/").split("/"):
        if path.startswith(_PREFIXES):
            raise Http404
        path = _INDEX

    root = str(settings.FRONTEND_DIST_DIR)
    full = os.path.join(root, path)

    if os.path.isfile(full):
        # Immutable, hashed build assets can be cached hard; index.html cannot.
        if path == _INDEX:
            resp = FileResponse(open(full, "rb"))
            resp["Cache-Control"] = "no-cache"
            return resp
        return static_serve(request, path, document_root=root)

    # Unknown asset (e.g. an old build path) must NOT return HTML with a 200 —
    # fall back to the SPA entry point with the correct document type.
    index = os.path.join(root, _INDEX)
    if not os.path.isfile(index):
        raise Http404("Frontend build not found. Build the frontend and copy dist/ "
                      "into backendcircuit/frontend_dist (see SETUP.md).")
    resp = FileResponse(open(index, "rb"))
    resp["Cache-Control"] = "no-cache"
    return resp

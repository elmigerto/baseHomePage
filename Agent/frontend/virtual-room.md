# Virtual Gallery Room

Guidelines for implementing the fullscreen 3D gallery room accessible at `/drawings/room`.

- Use **React Three Fiber** with Drei helpers.
- Allow the camera to pan freely using `MapControls`.
- Place paintings on the left wall (`x=-5`), right wall (`x=5`), and ceiling (`y=5`).
- Build each wall from `<Plane />` meshes textured with images from `src/files/drawings`.
- Duplicate wall segments horizontally so the room appears endless as the camera moves.
- Images should load via `import.meta.glob` as in the rest of the gallery.
- Keep the implementation lightweight and responsive.

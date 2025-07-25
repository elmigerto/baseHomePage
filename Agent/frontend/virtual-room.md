# Virtual Gallery Room

Guidelines for implementing the fullscreen 3D gallery room accessible at `/drawings`.

- Use **React Three Fiber** with Drei helpers.
- Allow the camera to pan freely using `MapControls`.
- Place paintings on the left wall (`x=-5`), right wall (`x=5`), and ceiling (`y=5`).
- Build each wall from `<Plane />` meshes textured with images from `src/files/drawings`.
- Duplicate wall segments horizontally so the room appears endless as the camera moves.
- Images should load via `import.meta.glob` as in the rest of the gallery.
- Keep the implementation lightweight and responsive.


## File Location
The main implementation is in `tobis-space/src/pages/DrawingsRoom.tsx`. This component sets up the React Three Fiber scene and loads the images using `../files/drawings/index.ts`.

## Editing Tips
- Start the frontend with `npm run dev` inside `tobis-space` to iterate quickly.
- Each drawing entry is defined in `src/files/drawings/index.ts` by scanning the `drawings/` folder. Add images or adjust `info.csv` to update descriptions and prices.
- `GallerySegment` in `DrawingsRoom.tsx` duplicates artwork groups to fake an endless corridor. Modify the `ART_SPACING` constant or the placement logic to change spacing.
- Styles rely on Tailwind classes. Use the `min-h-screen` layout rule from the agent briefing for consistency.


- The virtual room uses the same painting list as the scrolling room. Any images added to `src/files/drawings` will automatically appear in both views.

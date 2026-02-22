/**
 * MeshBackground — Animated CSS mesh gradient background.
 * Replaces the old Three.js NeuralSubstrate with a zero-dependency,
 * GPU-composited background that matches the biohack.berlin aesthetic.
 */
export function MeshBackground() {
  return (
    <div className="mesh-bg" aria-hidden="true">
      <div className="mesh-orb" />
    </div>
  );
}

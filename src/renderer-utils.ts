import { TetrisPiece } from './pieces';

// Utilitaires pour le rendu des pièces dans les canvas de preview (hold, next)
export function drawPieceOnCanvas(
  canvas: HTMLCanvasElement,
  piece: TetrisPiece | null,
  blockSize: number = 25
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!piece) return;

  const shape = piece.getShape();
  const offsetX = (canvas.width - shape[0].length * blockSize) / 2;
  const offsetY = (canvas.height - shape.length * blockSize) / 2;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        // Bloc principal
        ctx.fillStyle = piece.color;
        ctx.fillRect(
          offsetX + x * blockSize,
          offsetY + y * blockSize,
          blockSize,
          blockSize
        );

        // Bordure
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          offsetX + x * blockSize,
          offsetY + y * blockSize,
          blockSize,
          blockSize
        );

        // Effet de lumière
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(
          offsetX + x * blockSize + 2,
          offsetY + y * blockSize + 2,
          blockSize - 4,
          Math.min(10, blockSize / 3)
        );
      }
    }
  }
}

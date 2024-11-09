import { useEffect, useRef } from 'react';

const Confetti = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const colors = [
      '#ff718d',  // Pink
      '#fdff6a',  // Yellow
      '#7afcff',  // Cyan
      '#ff8e47',  // Orange
      '#90ff7e',  // Green
      '#bf9eff'   // Purple
    ];

    class ConfettiPiece {
      constructor(initialY = null) {
        this.reset(initialY);
      }

      reset(forcedY = null) {
        // Position
        this.x = Math.random() * canvas.width;
        this.y = forcedY !== null ? forcedY : Math.random() * -canvas.height;
        
        // Size
        this.width = Math.random() * 8 + 3;
        this.height = Math.random() * 4 + 2;
        
        // Much slower initial speeds
        this.speed = Math.random() * 1 + 0.5;  // Reduced speed range
        this.verticalVelocity = Math.random() * 1;  // Reduced initial vertical velocity
        this.horizontalVelocity = (Math.random() * 1 - 0.5) * 0.5;  // Reduced horizontal movement
        
        // Slower rotation
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() * 2 - 1) * 0.5;  // Much slower rotation
        
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.shape = Math.floor(Math.random() * 3);
        
        // Reduced physics values
        this.gravity = 0.03;  // Much lower gravity
        this.drag = 0.995;    // Higher drag for slower movement
        this.wobble = (Math.random() * 0.05 - 0.025) * 0.5;  // Reduced wobble
      }

      update() {
        // Slower vertical movement
        this.verticalVelocity += this.gravity;
        
        // Slower overall movement
        this.y += this.verticalVelocity * 0.7;  // Reduced vertical speed
        this.x += (this.horizontalVelocity + Math.sin(this.y * 0.02) * 0.3) * 0.7;  // Reduced horizontal speed
        
        this.horizontalVelocity *= this.drag;
        
        // Slower rotation
        this.rotation += this.rotationSpeed * 0.7;
        this.rotationSpeed *= 0.99;
        
        this.horizontalVelocity += this.wobble;
        
        if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.beginPath();

        switch(this.shape) {
          case 0:
            ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
            break;
          
          case 1:
            ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
            ctx.fill();
            break;
          
          case 2:
            ctx.beginPath();
            ctx.moveTo(-this.width/2, this.height/2);
            ctx.lineTo(this.width/2, this.height/2);
            ctx.lineTo(0, -this.height/2);
            ctx.closePath();
            ctx.fill();
            break;
        }
        
        ctx.restore();
      }
    }

    // Create pieces with distributed initial positions
    const pieces = Array(80).fill().map(() => {
      const initialY = Math.random() * canvas.height * 0.8;
      return new ConfettiPiece(initialY);
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces.forEach(piece => {
        piece.update();
        piece.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
    />
  );
};

export default Confetti;
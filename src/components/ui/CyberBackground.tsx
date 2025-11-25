import React, { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

const CyberBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const { resolvedTheme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let mouseX = 0;
        let mouseY = 0;

        const particles: Particle[] = [];
        const gridSpacing = 50;
        let time = 0;

        const isDark = resolvedTheme === 'dark';
        const primaryColor = isDark ? '0, 204, 102' : '0, 150, 80'; // Adjust primary for light mode if needed
        const gridColor = isDark ? 'rgba(0, 204, 102, 0.03)' : 'rgba(0, 100, 50, 0.05)';
        const bgColorStart = isDark ? '#09110C' : '#F0FDF4';
        const bgColorEnd = isDark ? '#0F1A14' : '#FFFFFF';

        class Particle {
            x: number;
            y: number;
            baseX: number;
            baseY: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
            density: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.baseX = this.x;
                this.baseY = this.y;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(${primaryColor}, ${Math.random() * 0.5 + 0.1})`;
                this.density = (Math.random() * 30) + 1;
            }

            update() {
                // Mouse interaction
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = 150;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                if (distance < maxDistance) {
                    this.x -= directionX;
                    this.y -= directionY;
                } else {
                    if (this.x !== this.baseX) {
                        const dx = this.x - this.baseX;
                        this.x -= dx / 10;
                    }
                    if (this.y !== this.baseY) {
                        const dy = this.y - this.baseY;
                        this.y -= dy / 10;
                    }
                }

                // Natural movement
                this.baseX += this.speedX;
                this.baseY += this.speedY;

                if (this.baseX > width) this.baseX = 0;
                if (this.baseX < 0) this.baseX = width;
                if (this.baseY > height) this.baseY = 0;
                if (this.baseY < 0) this.baseY = height;
            }

            draw() {
                if (!ctx) return;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const initParticles = () => {
            particles.length = 0;
            for (let i = 0; i < 80; i++) {
                particles.push(new Particle());
            }
        };

        const drawGrid = () => {
            if (!ctx) return;
            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;

            // Perspective grid effect
            const perspective = 500;
            const horizon = height * 0.6;

            // Vertical lines
            for (let x = 0; x <= width; x += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }

            // Horizontal lines with movement
            const offset = (time * 20) % gridSpacing;
            for (let y = 0; y <= height; y += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(0, y + offset);
                ctx.lineTo(width, y + offset);
                ctx.stroke();
            }
        };

        const connectParticles = () => {
            if (!ctx) return;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.strokeStyle = `rgba(${primaryColor}, ${1 - distance / 100})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        const animate = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, width, height);

            // Draw background gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, bgColorStart);
            gradient.addColorStop(1, bgColorEnd);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            drawGrid();

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            connectParticles();

            time += 0.01;
            requestAnimationFrame(animate);
        };

        initParticles();
        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.x;
            mouseY = e.y;
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [resolvedTheme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
};

export default CyberBackground;

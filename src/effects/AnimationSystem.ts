import gsap from 'gsap';
import * as PIXI from 'pixi.js';

export interface AnimationConfig {
  duration?: number;
  ease?: string;
  onComplete?: () => void;
}

/**
 * Animation system using GSAP for smooth tweening
 */
export class AnimationSystem {
  private activeAnimations: gsap.core.Tween[] = [];

  /**
   * Animate a container with a bounce effect
   */
  public bounce(
    target: PIXI.Container,
    config: AnimationConfig = {}
  ): gsap.core.Tween {
    const { duration = 0.3, ease = 'bounce.out', onComplete } = config;
    
    const tween = gsap.from(target, {
      y: target.y - 20,
      duration,
      ease,
      onComplete
    });
    
    this.activeAnimations.push(tween);
    return tween;
  }

  /**
   * Pulse animation for emphasis
   */
  public pulse(
    target: PIXI.Container,
    config: AnimationConfig = {}
  ): gsap.core.Tween {
    const { duration = 0.5, ease = 'power2.inOut' } = config;
    
    const tween = gsap.to(target.scale, {
      x: 1.2,
      y: 1.2,
      duration: duration / 2,
      ease,
      yoyo: true,
      repeat: 1
    });
    
    this.activeAnimations.push(tween);
    return tween;
  }

  /**
   * Fade in animation
   */
  public fadeIn(
    target: PIXI.Container,
    config: AnimationConfig = {}
  ): gsap.core.Tween {
    const { duration = 0.5, ease = 'power2.out', onComplete } = config;
    
    target.alpha = 0;
    const tween = gsap.to(target, {
      alpha: 1,
      duration,
      ease,
      onComplete
    });
    
    this.activeAnimations.push(tween);
    return tween;
  }

  /**
   * Fade out animation
   */
  public fadeOut(
    target: PIXI.Container,
    config: AnimationConfig = {}
  ): gsap.core.Tween {
    const { duration = 0.5, ease = 'power2.in', onComplete } = config;
    
    const tween = gsap.to(target, {
      alpha: 0,
      duration,
      ease,
      onComplete
    });
    
    this.activeAnimations.push(tween);
    return tween;
  }

  /**
   * Slide in from side
   */
  public slideIn(
    target: PIXI.Container,
    direction: 'left' | 'right' | 'top' | 'bottom' = 'top',
    distance: number = 100,
    config: AnimationConfig = {}
  ): gsap.core.Tween {
    const { duration = 0.6, ease = 'power3.out', onComplete } = config;
    
    const startPos: any = { alpha: 0 };
    switch (direction) {
      case 'left':
        startPos.x = target.x - distance;
        break;
      case 'right':
        startPos.x = target.x + distance;
        break;
      case 'top':
        startPos.y = target.y - distance;
        break;
      case 'bottom':
        startPos.y = target.y + distance;
        break;
    }
    
    const tween = gsap.from(target, {
      ...startPos,
      alpha: 0,
      duration,
      ease,
      onComplete
    });
    
    this.activeAnimations.push(tween);
    return tween;
  }

  /**
   * Shake animation for impact
   */
  public shake(
    target: PIXI.Container,
    intensity: number = 5,
    config: AnimationConfig = {}
  ): gsap.core.Tween {
    const { duration = 0.5 } = config;
    const originalX = target.x;
    const originalY = target.y;
    
    const tween = gsap.to(target, {
      x: `+=${intensity}`,
      y: `+=${intensity}`,
      duration: 0.05,
      repeat: Math.floor(duration / 0.05),
      yoyo: true,
      ease: 'none',
      onUpdate: () => {
        target.x = originalX + (Math.random() - 0.5) * intensity;
        target.y = originalY + (Math.random() - 0.5) * intensity;
      },
      onComplete: () => {
        target.x = originalX;
        target.y = originalY;
      }
    });
    
    this.activeAnimations.push(tween);
    return tween;
  }

  /**
   * Rotate animation
   */
  public rotate(
    target: PIXI.Container,
    angle: number = 360,
    config: AnimationConfig = {}
  ): gsap.core.Tween {
    const { duration = 1, ease = 'power2.inOut', onComplete } = config;
    
    const tween = gsap.to(target, {
      rotation: (angle * Math.PI) / 180,
      duration,
      ease,
      onComplete
    });
    
    this.activeAnimations.push(tween);
    return tween;
  }

  /**
   * Sequential animation timeline
   */
  public createTimeline(): gsap.core.Timeline {
    const timeline = gsap.timeline();
    return timeline;
  }

  /**
   * Animate piece drop with bounce
   */
  public animatePieceDrop(
    piece: PIXI.Container,
    finalY: number,
    config: AnimationConfig = {}
  ): gsap.core.Tween {
    const { duration = 0.3, ease = 'bounce.out', onComplete } = config;
    
    const tween = gsap.to(piece, {
      y: finalY,
      duration,
      ease,
      onComplete
    });
    
    this.activeAnimations.push(tween);
    return tween;
  }

  /**
   * Level up celebration animation
   */
  public levelUpCelebration(
    container: PIXI.Container,
    onComplete?: () => void
  ): gsap.core.Timeline {
    const timeline = gsap.timeline({ onComplete });
    
    timeline
      .to(container.scale, {
        x: 1.5,
        y: 1.5,
        duration: 0.3,
        ease: 'back.out(2)'
      })
      .to(container, {
        rotation: Math.PI * 2,
        duration: 0.6,
        ease: 'power2.inOut'
      }, '<')
      .to(container.scale, {
        x: 1,
        y: 1,
        duration: 0.3,
        ease: 'power2.in'
      });
    
    return timeline;
  }

  /**
   * Combo display animation
   */
  public comboAnimation(
    text: PIXI.Container,
    combo: number
  ): gsap.core.Timeline {
    const intensity = Math.min(combo / 10, 1);
    const timeline = gsap.timeline();
    
    timeline
      .from(text.scale, {
        x: 0,
        y: 0,
        duration: 0.2,
        ease: 'back.out(3)'
      })
      .to(text.scale, {
        x: 1.2 + intensity * 0.5,
        y: 1.2 + intensity * 0.5,
        duration: 0.2,
        ease: 'power2.out'
      })
      .to(text, {
        alpha: 0,
        duration: 0.5,
        ease: 'power2.in',
        delay: 0.5
      })
      .to(text.scale, {
        x: 0.5,
        y: 0.5,
        duration: 0.5,
        ease: 'power2.in'
      }, '<');
    
    return timeline;
  }

  /**
   * Clear line animation with expand and fade
   */
  public clearLineAnimation(
    blocks: PIXI.Container[],
    onComplete?: () => void
  ): gsap.core.Timeline {
    const timeline = gsap.timeline({ onComplete });
    
    blocks.forEach((block, index) => {
      const delay = index * 0.02; // Stagger effect
      
      timeline.to(block.scale, {
        x: 1.5,
        y: 1.5,
        duration: 0.3,
        ease: 'back.out(2)',
        delay
      }, 0);
      
      timeline.to(block, {
        alpha: 0,
        rotation: Math.random() * Math.PI,
        duration: 0.4,
        ease: 'power2.in',
        delay
      }, 0.2);
    });
    
    return timeline;
  }

  /**
   * Kill all active animations
   */
  public killAll(): void {
    this.activeAnimations.forEach(tween => tween.kill());
    this.activeAnimations = [];
    gsap.killTweensOf('*');
  }

  /**
   * Pause all animations
   */
  public pauseAll(): void {
    gsap.globalTimeline.pause();
  }

  /**
   * Resume all animations
   */
  public resumeAll(): void {
    gsap.globalTimeline.resume();
  }

  /**
   * Get active animation count
   */
  public getActiveCount(): number {
    return this.activeAnimations.filter(tween => tween.isActive()).length;
  }
}

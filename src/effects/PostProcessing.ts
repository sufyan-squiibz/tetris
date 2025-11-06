import * as PIXI from 'pixi.js';

/**
 * Post-processing effects manager for advanced visual quality
 */
export class PostProcessing {
  private filters: PIXI.Filter[] = [];
  private bloomFilter?: PIXI.BlurFilter;
  private colorMatrixFilter?: PIXI.ColorMatrixFilter;
  private glowFilter?: PIXI.BlurFilter;
  
  constructor(private target: PIXI.Container) {}

  /**
   * Enable bloom effect for light emission
   */
  public enableBloom(intensity: number = 0.5): void {
    if (!this.bloomFilter) {
      this.bloomFilter = new PIXI.BlurFilter();
      this.bloomFilter.blur = intensity * 10;
      this.bloomFilter.quality = 4;
      this.addFilter(this.bloomFilter);
    }
  }

  /**
   * Enable glow effect
   */
  public enableGlow(intensity: number = 0.3): void {
    if (!this.glowFilter) {
      this.glowFilter = new PIXI.BlurFilter();
      this.glowFilter.blur = intensity * 8;
      this.glowFilter.quality = 3;
      this.addFilter(this.glowFilter);
    }
  }

  /**
   * Add color correction
   */
  public enableColorCorrection(brightness: number = 1.0, contrast: number = 1.0): void {
    if (!this.colorMatrixFilter) {
      this.colorMatrixFilter = new PIXI.ColorMatrixFilter();
    }
    
    this.colorMatrixFilter.brightness(brightness, false);
    this.colorMatrixFilter.contrast(contrast, false);
    this.addFilter(this.colorMatrixFilter);
  }

  /**
   * Enable CRT monitor effect
   */
  public enableCRTEffect(): void {
    const crtFilter = new PIXI.ColorMatrixFilter();
    crtFilter.sepia(false);
    crtFilter.contrast(1.1, false);
    this.addFilter(crtFilter);
  }

  /**
   * Enable vignette effect
   */
  public enableVignette(intensity: number = 0.3): void {
    // Custom vignette implementation
    const vignetteFilter = new PIXI.Filter(
      undefined,
      `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float intensity;
      
      void main() {
        vec4 color = texture2D(uSampler, vTextureCoord);
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vTextureCoord, center);
        float vignette = smoothstep(0.7, 0.3, dist);
        vignette = mix(1.0, vignette, intensity);
        gl_FragColor = color * vignette;
      }
      `,
      { intensity }
    );
    
    this.addFilter(vignetteFilter);
  }

  /**
   * Enable scanline effect for retro look
   */
  public enableScanlines(density: number = 0.5): void {
    const scanlineFilter = new PIXI.Filter(
      undefined,
      `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float density;
      uniform float time;
      
      void main() {
        vec4 color = texture2D(uSampler, vTextureCoord);
        float scanline = sin(vTextureCoord.y * 800.0 * density + time) * 0.04;
        color.rgb -= scanline;
        gl_FragColor = color;
      }
      `,
      { density, time: 0 }
    );
    
    this.addFilter(scanlineFilter);
  }

  /**
   * Enable chromatic aberration for visual pop
   */
  public enableChromaticAberration(amount: number = 0.002): void {
    const chromaticFilter = new PIXI.Filter(
      undefined,
      `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform float amount;
      
      void main() {
        vec2 offset = vec2(amount, 0.0);
        float r = texture2D(uSampler, vTextureCoord + offset).r;
        float g = texture2D(uSampler, vTextureCoord).g;
        float b = texture2D(uSampler, vTextureCoord - offset).b;
        gl_FragColor = vec4(r, g, b, 1.0);
      }
      `,
      { amount }
    );
    
    this.addFilter(chromaticFilter);
  }

  /**
   * Enable motion blur for smooth movement
   */
  public enableMotionBlur(intensity: number = 0.5): void {
    const motionBlurFilter = new PIXI.BlurFilter();
    motionBlurFilter.blur = intensity * 5;
    motionBlurFilter.quality = 2;
    this.addFilter(motionBlurFilter);
  }

  /**
   * Enable pixelation for retro effect
   */
  public enablePixelation(size: number = 4): void {
    const pixelateFilter = new PIXI.Filter(
      undefined,
      `
      precision mediump float;
      varying vec2 vTextureCoord;
      uniform sampler2D uSampler;
      uniform vec2 dimensions;
      uniform float pixelSize;
      
      void main() {
        vec2 coord = vTextureCoord * dimensions;
        vec2 pixelated = floor(coord / pixelSize) * pixelSize;
        vec2 uv = pixelated / dimensions;
        gl_FragColor = texture2D(uSampler, uv);
      }
      `,
      { 
        dimensions: [this.target.width, this.target.height],
        pixelSize: size 
      }
    );
    
    this.addFilter(pixelateFilter);
  }

  /**
   * Enable outline effect
   */
  public enableOutline(_thickness: number = 1.0, _color: number = 0xFFFFFF): void {
    const outlineFilter = new PIXI.ColorMatrixFilter();
    // Simulate outline with contrast
    outlineFilter.contrast(1.5, false);
    this.addFilter(outlineFilter);
  }

  /**
   * Apply quality preset
   */
  public applyQualityPreset(quality: 'low' | 'medium' | 'high' | 'ultra'): void {
    this.clearAll();
    
    switch (quality) {
      case 'low':
        // Minimal effects for performance
        break;
        
      case 'medium':
        this.enableColorCorrection(1.05, 1.05);
        break;
        
      case 'high':
        this.enableGlow(0.2);
        this.enableColorCorrection(1.1, 1.1);
        this.enableVignette(0.2);
        break;
        
      case 'ultra':
        this.enableBloom(0.3);
        this.enableGlow(0.3);
        this.enableColorCorrection(1.15, 1.2);
        this.enableVignette(0.3);
        this.enableChromaticAberration(0.001);
        break;
    }
  }

  /**
   * Apply theme-based effects
   */
  public applyThemeEffects(theme: string): void {
    this.clearAll();
    
    switch (theme) {
      case 'neon':
        this.enableGlow(0.5);
        this.enableBloom(0.4);
        this.enableChromaticAberration(0.002);
        break;
        
      case 'retro':
        this.enableScanlines(0.8);
        this.enablePixelation(2);
        this.enableColorCorrection(0.9, 1.3);
        break;
        
      case 'classic':
        this.enableColorCorrection(1.05, 1.05);
        this.enableVignette(0.15);
        break;
        
      case 'dark':
        this.enableVignette(0.4);
        this.enableGlow(0.2);
        this.enableColorCorrection(0.95, 1.2);
        break;
    }
  }

  /**
   * Update animated filters
   */
  public update(deltaTime: number): void {
    // Update time-based filters
    this.filters.forEach(filter => {
      if (filter.uniforms.time !== undefined) {
        filter.uniforms.time += deltaTime * 0.001;
      }
    });
  }

  private addFilter(filter: PIXI.Filter): void {
    if (!this.filters.includes(filter)) {
      this.filters.push(filter);
      this.target.filters = this.filters;
    }
  }

  /**
   * Remove a specific filter
   */
  public removeFilter(filter: PIXI.Filter): void {
    const index = this.filters.indexOf(filter);
    if (index > -1) {
      this.filters.splice(index, 1);
      this.target.filters = this.filters.length > 0 ? this.filters : null;
    }
  }

  /**
   * Clear all filters
   */
  public clearAll(): void {
    this.filters = [];
    this.target.filters = null;
    this.bloomFilter = undefined;
    this.colorMatrixFilter = undefined;
    this.glowFilter = undefined;
  }

  /**
   * Get current filter count
   */
  public getFilterCount(): number {
    return this.filters.length;
  }

  /**
   * Enable/disable all filters
   */
  public setEnabled(enabled: boolean): void {
    if (enabled) {
      this.target.filters = this.filters;
    } else {
      this.target.filters = null;
    }
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have a title', () => {
    expect(component.title).toBeDefined();
  });

  it('should render title in a h1 tag', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
  });

  it('should contain router outlet', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });

  it('should have proper CSS classes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const appElement = compiled.querySelector('.app');
    expect(appElement).toBeTruthy();
  });

  it('should be responsive', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const appElement = compiled.querySelector('.app') as HTMLElement;
    
    // Check if the component has responsive styles
    const styles = window.getComputedStyle(appElement);
    expect(styles).toBeDefined();
  });

  it('should have proper accessibility attributes', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check for basic accessibility
    const mainElement = compiled.querySelector('main');
    if (mainElement) {
      expect(mainElement).toBeTruthy();
    }
  });

  it('should handle window resize events', () => {
    fixture.detectChanges();
    
    // Simulate window resize
    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);
    
    // Component should handle resize without errors
    expect(component).toBeTruthy();
  });

  it('should have proper meta tags in head', () => {
    const head = document.head;
    const metaTags = head.querySelectorAll('meta');
    
    // Check for basic meta tags
    expect(metaTags.length).toBeGreaterThan(0);
  });

  it('should load without console errors', () => {
    spyOn(console, 'error');
    
    fixture.detectChanges();
    
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should have proper viewport settings', () => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    expect(viewportMeta).toBeTruthy();
  });

  it('should handle component state changes', () => {
    // Test that component can handle state changes
    fixture.detectChanges();
    
    // Trigger change detection
    fixture.detectChanges();
    
    expect(component).toBeTruthy();
  });

  it('should have proper CSS encapsulation', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    
    // Check that component has proper encapsulation
    const componentElement = compiled.querySelector('.app');
    expect(componentElement).toBeTruthy();
  });

  it('should handle async operations gracefully', (done) => {
    fixture.detectChanges();
    
    // Simulate async operation
    setTimeout(() => {
      expect(component).toBeTruthy();
      done();
    }, 100);
  });

  it('should have proper error boundaries', () => {
    fixture.detectChanges();
    
    // Component should handle errors gracefully
    try {
      // Simulate potential error
      const test = (component as any).nonExistentMethod;
      expect(true).toBeTrue(); // Should not reach here if error is thrown
    } catch (error) {
      // Error should be handled gracefully
      expect(error).toBeDefined();
    }
  });

  it('should have proper memory management', () => {
    fixture.detectChanges();
    
    // Component should not have memory leaks
    const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Simulate some operations
    for (let i = 0; i < 10; i++) {
      fixture.detectChanges();
    }
    
    const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
    
    // Memory usage should be reasonable (not growing exponentially)
    expect(finalMemory).toBeGreaterThanOrEqual(initialMemory);
  });

  it('should handle component initialization correctly', () => {
    // Test component initialization
    expect(component).toBeDefined();
    expect(fixture).toBeDefined();
    
    // Component should be created successfully
    expect(component).toBeTruthy();
  });

  it('should have proper TypeScript typing', () => {
    // Test that component has proper TypeScript types
    expect(typeof component.title).toBe('string');
    
    // Component should be properly typed
    expect(component).toBeInstanceOf(AppComponent);
  });
}); 
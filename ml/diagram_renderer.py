import io
import textwrap
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image, ImageDraw, ImageFont

def render_diagram(visual_data, size, theme="dark"):
    """
    Renders a specific diagram type using Matplotlib, returning a PIL Image.
    """
    if not visual_data or not isinstance(visual_data, dict):
        return _fallback_image("Unknown", size, theme)
        
    scene_type = visual_data.get("type", "unknown")
    data = visual_data.get("data", {})
    
    # Theme colors
    if theme == "dark":
        bg_color = "#121826"
        text_color = "#F5F6F8"
    else:
        bg_color = "#F5F6F8"
        text_color = "#14171B"
        
    accent_color = "#E63946"
    sec_color = "#4A90E2"
    success_color = "#2ECC71"
    
    # Set up matplotlib figure
    fig_width = size[0] / 100
    fig_height = size[1] / 100
    fig, ax = plt.subplots(figsize=(fig_width, fig_height), facecolor=bg_color)
    ax.set_facecolor(bg_color)
    ax.axis('off')
    
    try:
        if scene_type == "definition":
            _render_definition(ax, data, text_color, accent_color, sec_color)
        elif scene_type == "flowchart":
            _render_flowchart(ax, data, text_color, accent_color, sec_color)
        elif scene_type == "timeline":
            _render_timeline(ax, data, text_color, accent_color)
        elif scene_type == "comparison":
            _render_comparison(ax, data, text_color, accent_color, sec_color)
        elif scene_type == "diagram":
            _render_grid_diagram(ax, data, text_color, accent_color, sec_color)
        elif scene_type == "bar_chart":
            _render_bar_chart(ax, data, text_color, accent_color)
        elif scene_type == "bullet_points":
            _render_bullet_points(ax, data, text_color, accent_color)
        else:
            plt.close(fig)
            return _fallback_image(scene_type, size, theme)
            
        buf = io.BytesIO()
        fig.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor=bg_color)
        buf.seek(0)
        img = Image.open(buf).convert('RGB')
        img = img.resize(size, Image.LANCZOS)
        return img
    except Exception as e:
        print(f"Error rendering {scene_type}: {e}")
        return _fallback_image(scene_type, size, theme)
    finally:
        plt.close(fig)

def _render_definition(ax, data, text_color, accent_color, sec_color):
    term = data.get("term", "")
    explanation = data.get("explanation", "")
    example = data.get("example", None)
    
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    
    # Term
    ax.text(50, 85, term, color=text_color, fontsize=40, ha='center', va='center', fontweight='bold')
    
    # Accent line
    ax.plot([30, 70], [78, 78], color=accent_color, lw=3)
    
    # Explanation
    wrapped_exp = "\n".join(textwrap.wrap(explanation, width=40))
    ax.text(50, 50, wrapped_exp, color=text_color, fontsize=24, ha='center', va='center')
    
    # Example
    if example:
        wrapped_ex = "\n".join(textwrap.wrap(f"Example: {example}", width=45))
        ax.text(50, 20, wrapped_ex, color=sec_color, fontsize=20, ha='center', va='center', style='italic')

def _render_flowchart(ax, data, text_color, accent_color, sec_color):
    steps = data.get("steps", [])
    if not steps:
        return
        
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    
    max_steps = 6
    display_steps = steps[:max_steps]
    if len(steps) > max_steps:
        display_steps[-1] = "..."
        
    n = len(display_steps)
    if n == 0:
        return
        
    y_starts = [90 - i * (80/n) for i in range(n)]
    box_height = min(15, 60/n)
    box_width = 70
    
    for i, step in enumerate(display_steps):
        y = y_starts[i]
        color = accent_color if i % 2 == 0 else sec_color
        
        # Draw box
        box = patches.FancyBboxPatch(
            (15, y - box_height), box_width, box_height,
            boxstyle="round,pad=0.2", fc=color, ec="none", alpha=0.9
        )
        ax.add_patch(box)
        
        # Text
        wrapped_step = "\n".join(textwrap.wrap(str(step), width=45))
        ax.text(50, y - box_height/2, wrapped_step, color="white", fontsize=18, ha='center', va='center', fontweight='bold')
        
        # Arrow down
        if i < n - 1:
            ax.annotate(
                '', xy=(50, y_starts[i+1]), xytext=(50, y - box_height),
                arrowprops=dict(arrowstyle='->', color=text_color, lw=2)
            )

def _render_timeline(ax, data, text_color, accent_color):
    events = data.get("events", [])
    if not events:
        return
        
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    
    # Middle line
    ax.plot([5, 95], [50, 50], color=text_color, lw=2)
    
    n = len(events)
    if n == 0: return
    x_positions = [10 + i * (80/max(1, n-1)) for i in range(n)] if n > 1 else [50]
    
    for i, event in enumerate(events):
        x = x_positions[i]
        year = event.get("year", "")
        label = event.get("label", "")
        
        # Dot
        ax.plot(x, 50, 'o', color=accent_color, markersize=12)
        
        # Alternating positions
        if i % 2 == 0:
            y_year, y_label = 55, 62
            va_year, va_label = 'bottom', 'bottom'
            ax.plot([x, x], [50, 54], color=text_color, lw=1)
        else:
            y_year, y_label = 45, 38
            va_year, va_label = 'top', 'top'
            ax.plot([x, x], [50, 46], color=text_color, lw=1)
            
        ax.text(x, y_year, str(year), color=accent_color, fontsize=16, ha='center', va=va_year, fontweight='bold')
        wrapped_label = "\n".join(textwrap.wrap(str(label), width=15))
        ax.text(x, y_label, wrapped_label, color=text_color, fontsize=14, ha='center', va=va_label)

def _render_comparison(ax, data, text_color, accent_color, sec_color):
    left_label = data.get("left_label", "Left")
    right_label = data.get("right_label", "Right")
    left_points = data.get("left_points", [])
    right_points = data.get("right_points", [])
    
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    
    # Divider
    ax.plot([50, 50], [10, 90], color=text_color, lw=1, alpha=0.3)
    
    # Headers
    ax.text(25, 90, left_label, color=accent_color, fontsize=28, ha='center', va='top', fontweight='bold')
    ax.text(75, 90, right_label, color=sec_color, fontsize=28, ha='center', va='top', fontweight='bold')
    
    # Left points
    y = 75
    for pt in left_points:
        wrapped = "\n".join(textwrap.wrap(str(pt), width=25))
        ax.text(5, y, f"• {wrapped}", color=text_color, fontsize=18, ha='left', va='top')
        y -= 5 + 3 * wrapped.count('\n')
        
    # Right points
    y = 75
    for pt in right_points:
        wrapped = "\n".join(textwrap.wrap(str(pt), width=25))
        ax.text(55, y, f"• {wrapped}", color=text_color, fontsize=18, ha='left', va='top')
        y -= 5 + 3 * wrapped.count('\n')

def _render_grid_diagram(ax, data, text_color, accent_color, sec_color):
    title = data.get("title", "")
    parts = data.get("parts", [])
    
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    
    if title:
        ax.text(50, 95, title, color=accent_color, fontsize=32, ha='center', va='top', fontweight='bold')
        
    n = len(parts)
    if n == 0: return
    
    cols = 2 if n > 3 else 1
    rows = (n + cols - 1) // cols
    
    box_w = 40 if cols == 2 else 60
    box_h = min(20, 70 / max(1, rows))
    
    for i, part in enumerate(parts):
        c = i % cols
        r = i // cols
        
        x_start = 5 + c * 50 if cols == 2 else 20
        y_start = 80 - r * (box_h + 5)
        
        color = accent_color if i % 2 == 0 else sec_color
        box = patches.FancyBboxPatch(
            (x_start, y_start - box_h), box_w, box_h,
            boxstyle="round,pad=0.2", fc=color, ec="none", alpha=0.1
        )
        ax.add_patch(box)
        
        label = part.get("label", "")
        desc = part.get("description", "")
        
        ax.text(x_start + box_w/2, y_start - box_h/2 + 2, str(label), color=color, fontsize=20, ha='center', va='bottom', fontweight='bold')
        wrapped_desc = "\n".join(textwrap.wrap(str(desc), width=int(box_w*0.8)))
        ax.text(x_start + box_w/2, y_start - box_h/2 - 2, wrapped_desc, color=text_color, fontsize=14, ha='center', va='top')

def _render_bar_chart(ax, data, text_color, accent_color):
    title = data.get("title", "")
    bars = data.get("bars", [])
    
    # We turn the axis back on but customize it heavily
    ax.axis('on')
    
    labels = [str(b.get("label", "")) for b in bars]
    values = [float(b.get("value", 0)) for b in bars]
    
    ax.bar(labels, values, color=accent_color, alpha=0.8, width=0.6)
    
    if title:
        ax.set_title(title, color=text_color, fontsize=24, fontweight='bold', pad=20)
        
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color(text_color)
    ax.spines['bottom'].set_color(text_color)
    ax.tick_params(colors=text_color, labelsize=14)
    ax.grid(axis='y', color=text_color, alpha=0.2)
    plt.setp(ax.get_xticklabels(), rotation=45, ha='right')

def _render_bullet_points(ax, data, text_color, accent_color):
    heading = data.get("heading", "")
    points = data.get("points", [])
    
    ax.set_xlim(0, 100)
    ax.set_ylim(0, 100)
    
    ax.text(10, 90, heading, color=accent_color, fontsize=32, ha='left', va='top', fontweight='bold')
    
    y = 75
    for pt in points:
        wrapped = "\n".join(textwrap.wrap(str(pt), width=50))
        ax.text(15, y, f"•", color=accent_color, fontsize=24, ha='right', va='top')
        ax.text(18, y, wrapped, color=text_color, fontsize=22, ha='left', va='top')
        y -= 8 + 4 * wrapped.count('\n')

def _fallback_image(scene_type, size, theme):
    bg_color = (18, 24, 38) if theme == "dark" else (245, 246, 248)
    text_color = (245, 246, 248) if theme == "dark" else (20, 23, 27)
    
    img = Image.new("RGB", size, color=bg_color)
    draw = ImageDraw.Draw(img)
    
    msg = f"Visual: {scene_type}"
    try:
        font = ImageFont.truetype("arial.ttf", 40)
    except:
        font = ImageFont.load_default()
        
    bbox = draw.textbbox((0, 0), msg, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    
    draw.text(((size[0]-w)/2, (size[1]-h)/2), msg, font=font, fill=text_color)
    return img

# Contact sheet of QA stills: python3 scripts/sheet.py out.png img1 img2 ...
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
ims = [Image.open(f).convert('RGB') for f in files]
w = 640
cols = 3 if ims[0].width > ims[0].height else 5
th = [int(im.height * w / im.width) for im in ims]
rows = (len(ims) + cols - 1) // cols
H = max(th)
sheet = Image.new('RGB', (cols * w + (cols - 1) * 6, rows * H + (rows - 1) * 6), 'red')
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    im = im.resize((w, th[i]))
    x, y = (i % cols) * (w + 6), (i // cols) * (H + 6)
    sheet.paste(im, (x, y))
    lab = f.split('-')[-1].rsplit('.', 1)[0].replace('_', '.') + 's'
    d.rectangle([x, y, x + 70, y + 22], fill='black')
    d.text((x + 6, y + 5), lab, fill='yellow')
sheet.save(out)

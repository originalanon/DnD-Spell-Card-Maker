// ==== 1) Hook up the button ====
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('card-settings');
  const btn  = document.getElementById('generateCard'); // your "Generate" button

  if (!form || !btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    buildSpellCard(form); // <- fire and forget
  });
});

// ==== 2) Main flow: read template -> fill -> write ====
async function buildSpellCard(form) {
  try {
    const data = collectSpellForm(form);

    // await #1: load template.html via preload bridge
    // (This pauses here until the preload returns the file contents.)
    const templateContent = await window.fsAPI.getTemplate('template.html');

    const filledHtml = fillTemplateWithFormData(templateContent, data);

    // Safe filename from spell name
    const safeName = (data.name || 'spell').replace(/[\\/:*?"<>|]/g, '_');

    // await #2: write the file via preload bridge
    await window.fsAPI.writeFile(`${safeName}.html`, filledHtml);

    console.log('Card saved:', `${safeName}.html`);

    // If you still want to use your SpellCard class, you can do it here:
    // const card = new SpellCard(data);
    // card.render();
  } catch (err) {
    console.error('Error creating card:', err);
  }
}

// ==== 3) Turn the form into a data object ====
function collectSpellForm(form) {
  const components = [];
  if (form.verbal?.checked) components.push('V');
  if (form.somatic?.checked) components.push('S');
  if (form['mat-components']?.checked) components.push('C');

  const rawRange = (form.range?.value ?? '').trim();
  const isTouch  = rawRange.toLowerCase() === 'touch';

  const classes = (form.classes?.value ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  return {
    name: (form.name?.value ?? '').trim(),
    level: Number(form.level?.value ?? 0),
    school: (form.school?.value ?? '').trim(),
    classes,
    range: isTouch ? 'Touch' : rawRange,
    castingTime: (form.castingTime?.value ?? '').trim(),
    components,
    duration: (form.duration?.value ?? '').trim(),
    description: (form.description?.value ?? '').trim(),
    source: (form.source?.value ?? '').trim(),
    link: ((form.link?.value ?? '').trim() || null),
  };
}

// ==== 4) Fill the template placeholders ====
function fillTemplateWithFormData(template, d) {
  // Build computed strings once:
  const levelSchoolText = d.level === 0
    ? `${d.school} Cantrip`
    : `${ordinal(d.level)} Level ${d.school}`;
  const componentsText = Array.isArray(d.components) ? d.components.join(', ') : (d.components ?? '');
  let rangeText = '—';
  if (d.range) {
    if (d.range.toLowerCase() === 'touch') rangeText = 'Touch';
    else if (!Number.isNaN(parseFloat(d.range))) rangeText = `${parseFloat(d.range)} ft`;
    else rangeText = d.range;
  }
  const classesText = Array.isArray(d.classes) ? d.classes.join(', ') : (d.classes ?? '');

  // Map placeholders -> values
  const values = {
    '${level-school}': levelSchoolText,
    '${title}': d.name || '(Unnamed Spell)',
    '${components}': componentsText || '—',
    '${duration}': d.duration || '—',
    '${casting-time}': d.castingTime || '—',
    '${range}': rangeText,
    '${description}': d.description || '',
    '${source}': d.source || '—',
    // Optional placeholders (only replaced if present):
    '${classes}': classesText || '—',
    '${qr_code}': '' // leave blank unless you generate a QR later
  };

  // Replace all occurrences of each placeholder
  let html = String(template);
  for (const [key, val] of Object.entries(values)) {
    html = replaceAll(html, key, val);
  }
  return html;
}

// Replace *all* occurrences (String.replace only does the first by default)
function replaceAll(str, find, replacement) {
  // Escape special regex chars in the placeholder:
  const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return str.replace(new RegExp(escaped, 'g'), replacement);
}

// Proper ordinals (handles 11/12/13)
function ordinal(n) {
  if (n === 0) return 'Cantrip';
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
}

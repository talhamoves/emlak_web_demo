import { supabase } from './supabase';

const formatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });

async function getPropertyById(id: string) {
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

// Make explicit global function for the onclick handler in the HTML string
(window as any).changeMainImage = (url: string) => {
  const mainImage = document.querySelector('.main-image') as HTMLElement;
  if (mainImage) mainImage.style.backgroundImage = `url('${url}')`;
};

function renderDetails(p: any) {
  const root = document.getElementById('details-root');
  if (!root) return;

  if (!p) {
    root.innerHTML = '<h1>İlan bulunamadı.</h1>';
    return;
  }

  // Build gallery HTML logic safely
  let galleryHtml = '';
  if (p.gallery && p.gallery.length > 0) {
    galleryHtml = p.gallery.map((img: string) =>
      `<div class="side-image" style="background-image: url('${img}')" onclick="window.changeMainImage('${img}')"></div>`
    ).join('');
  }

  // Construct the full HTML
  root.innerHTML = `
      <div class="details-gallery">
        <div class="main-image" style="background-image: url('${p.image_url}')"></div>
        <div class="side-images" id="gallery-container">
          ${galleryHtml}
        </div>
      </div>

      <div class="details-grid">
        <div class="details-content">
          <h1>${p.title}</h1>
          <div class="property-location" style="font-size: 1.1rem; margin-bottom: 30px;">
            <i class="fas fa-map-marker-alt"></i> ${p.location}
          </div>
          
          <div class="details-price">${formatter.format(p.price)}</div>

          <div class="details-features-list">
            <div class="details-feature-item">
              <i class="fas fa-layer-group"></i>
              <b>${p.category}</b>
              <span>Kategori</span>
            </div>
            <div class="details-feature-item">
              <i class="fas fa-home"></i>
              <b>${p.type}</b>
              <span>Türü</span>
            </div>
            <div class="details-feature-item">
              <i class="fas fa-vector-square"></i>
              <b>${p.sqm} m²</b>
              <span>Alan</span>
            </div>
            ${p.rooms ? `
            <div class="details-feature-item">
              <i class="fas fa-door-open"></i>
              <b>${p.rooms}</b>
              <span>Oda</span>
            </div>` : ''}
          </div>

          <div class="details-description">
            <h3>Açıklama</h3>
            <div class="formatted-content">${p.description || 'Açıklama bulunmamaktadır.'}</div>
          </div>

           <div class="details-features-list" style="margin-top: 30px; grid-template-columns: repeat(2, 1fr);">
            ${p.floor ? `<div class="details-feature-item"><span>Kat:</span> <b>${p.floor}</b></div>` : ''}
            ${p.heating ? `<div class="details-feature-item"><span>Isıtma:</span> <b>${p.heating}</b></div>` : ''}
            ${p.zoning_status ? `<div class="details-feature-item"><span>İmar:</span> <b>${p.zoning_status}</b></div>` : ''}
          </div>
        </div>

        <aside>
          <div class="contact-card">
             <div class="contact-header">
              <div class="contact-avatar">EA</div>
              <div>
                <h4>Emlak Advisor</h4>
                <span style="font-size: 0.9rem; opacity: 0.8;">Kurumsal Üyelik</span>
              </div>
            </div>
            <button class="btn btn-primary" style="width: 100%; margin-bottom: 10px;">
              <i class="fas fa-phone"></i> Hemen Ara
            </button>
            <button class="btn btn-accent" style="width: 100%;">
              <i class="fab fa-whatsapp"></i> WhatsApp Mesaj
            </button>
          </div>
        </aside>
      </div>
  `;
}

export async function initDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (id) {
    const property = await getPropertyById(id);
    renderDetails(property);
  }
}

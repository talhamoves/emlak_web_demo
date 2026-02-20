import './style.css'
import { supabase } from './supabase'

export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  category: 'Konut' | 'Arsa' | 'İşyeri';
  type: 'Satılık' | 'Kiralık';
  rooms?: string;
  sqm: number;
  floor?: string;
  heating?: string;
  is_zoned?: boolean;
  zoning_status?: string;
  image_url: string;
  gallery?: string[];
  description?: string;
  is_featured?: boolean;
  status: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  image_url: string;
  date: string;
  is_published: boolean;
  is_featured?: boolean;
}

const formatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });

async function fetchProperties(): Promise<Property[]> {
  const { data, error } = await supabase.from('properties').select('*');
  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
  return data as Property[];
}

async function fetchBlogs(): Promise<BlogPost[]> {
  const { data, error } = await supabase.from('blogs').select('*');
  if (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
  return data as BlogPost[];
}

function renderProperties(props: Property[]) {
  const featuredGrid = document.getElementById('featured-list');
  const propertyGrid = document.getElementById('property-list');

  if (featuredGrid) {
    const featured = props.filter(p => p.is_featured && p.status !== 'Pasif').slice(0, 3);
    featuredGrid.innerHTML = featured.map(p => createPropertyCard(p)).join('');
  }

  if (propertyGrid) {
    const activeProps = props.filter(p => p.status !== 'Pasif');
    if (activeProps.length === 0) {
      propertyGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 100px; color: var(--light-text); font-size: 1.2rem;">Kriterlere uygun ilan bulunamadı.</div>';
      return;
    }
    propertyGrid.innerHTML = activeProps.map(p => createPropertyCard(p)).join('');
  }
}

function renderBlogs(blogList: BlogPost[]) {
  const blogGrid = document.getElementById('blog-list');
  if (!blogGrid) return;

  const publishedBlogs = blogList.filter(b => b.is_published);
  blogGrid.innerHTML = publishedBlogs.map(b => `
    <div class="blog-card" onclick="window.location.href='/blog-detail.html?id=${b.id}'" style="cursor: pointer;">
      <div class="blog-image" style="background-image: url('${b.image_url}')">
        ${b.is_featured ? '<span class="blog-featured-tag">Öne Çıkan</span>' : ''}
      </div>
      <div class="blog-content">
        <div class="blog-date"><i class="far fa-calendar-alt"></i> ${b.date}</div>
        <h3 class="blog-title">${b.title}</h3>
        <p class="blog-excerpt">${b.excerpt}</p>
        <a href="/blog-detail.html?id=${b.id}" class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  `).join('');
}

function renderFullBlogList(blogList: BlogPost[]) {
  const fullBlogGrid = document.getElementById('full-blog-list');
  if (!fullBlogGrid) return;

  const publishedBlogs = blogList.filter(b => b.is_published);
  fullBlogGrid.innerHTML = publishedBlogs.map(b => `
    <div class="blog-card" onclick="window.location.href='/blog-detail.html?id=${b.id}'" style="cursor: pointer;">
      <div class="blog-image" style="background-image: url('${b.image_url}')">
        ${b.is_featured ? '<span class="blog-featured-tag">Öne Çıkan</span>' : ''}
      </div>
      <div class="blog-content">
        <div class="blog-date"><i class="far fa-calendar-alt"></i> ${b.date}</div>
        <h3 class="blog-title">${b.title}</h3>
        <p class="blog-excerpt">${b.excerpt}</p>
        <a href="/blog-detail.html?id=${b.id}" class="read-more">Devamını Oku <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  `).join('');
}

async function renderBlogDetail() {
  const detailContainer = document.getElementById('blog-detail-container');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) return;

  const { data: b, error } = await supabase.from('blogs').select('*').eq('id', id).single();

  if (error || !b) {
    detailContainer.innerHTML = '<div style="text-align: center; padding: 100px;">Yazı bulunamadı.</div>';
    return;
  }

  document.title = `${b.title} | Emlak Advisor`;

  detailContainer.innerHTML = `
    <article class="blog-detail-article">
      <header class="blog-detail-header">
        <div class="blog-date"><i class="far fa-calendar-alt"></i> ${b.date}</div>
        <h1>${b.title}</h1>
      </header>
      <div class="blog-detail-image" style="background-image: url('${b.image_url}')"></div>
      <div class="blog-detail-content formatted-content">
        ${b.content || b.excerpt}
      </div>
    </article>
  `;
}

async function renderPropertyDetail() {
  const detailContainer = document.getElementById('property-detail-container');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  if (!id) return;

  const { data: p, error } = await supabase.from('properties').select('*').eq('id', id).single();

  if (error || !p) {
    detailContainer.innerHTML = '<div style="text-align: center; padding: 100px;">İlan bulunamadı.</div>';
    return;
  }

  document.title = `${p.title} | Emlak Advisor`;

  // Dynamically injecting content into the details page structure
  // This assumes the details.html has specific IDs to populate
  const elements = {
    title: document.getElementById('det-title'),
    price: document.getElementById('det-price'),
    location: document.getElementById('det-location'),
    image: document.getElementById('det-image'),
    desc: document.getElementById('det-desc'),
    rooms: document.getElementById('det-rooms'),
    sqm: document.getElementById('det-sqm'),
    floor: document.getElementById('det-floor'),
    category: document.getElementById('det-category'),
    zoning: document.getElementById('det-zoning')
  };

  if (elements.title) elements.title.innerText = p.title;
  if (elements.price) elements.price.innerText = formatter.format(p.price);
  if (elements.location) elements.location.innerText = p.location;
  if (elements.image) (elements.image as HTMLDivElement).style.backgroundImage = `url('${p.image_url}')`;
  if (elements.desc) elements.desc.innerText = p.description || 'Açıklama bulunmuyor.';
  if (elements.rooms) elements.rooms.innerText = p.rooms || '-';
  if (elements.sqm) elements.sqm.innerText = `${p.sqm} m²`;
  if (elements.floor) elements.floor.innerText = p.floor || '-';
  if (elements.category) elements.category.innerText = p.category;
  if (elements.zoning) elements.zoning.innerText = p.zoning_status || '-';
}

function createPropertyCard(p: Property) {
  return `
    <div class="property-card" onclick="window.location.href='/details.html?id=${p.id}'">
      <div class="property-image" style="background-image: url('${p.image_url}')">
        <span class="property-tag">${p.type}</span>
        ${p.is_featured ? '<div class="featured-indicator"><i class="fas fa-star"></i> Öne Çıkan</div>' : ''}
      </div>
      <div class="property-content">
        <div class="property-price">${formatter.format(p.price)}</div>
        <div class="property-title">${p.title}</div>
        <div class="property-location"><i class="fas fa-map-marker-alt"></i> ${p.location}</div>
        <div class="property-features">
          ${p.rooms ? `<span><i class="fas fa-door-open"></i> ${p.rooms}</span>` : ''}
          ${p.zoning_status ? `<span><i class="fas fa-map"></i> ${p.zoning_status}</span>` : ''}
          <span><i class="fas fa-expand-arrows-alt"></i> ${p.sqm} m²</span>
        </div>
      </div>
    </div>
  `;
}

function handleSearch() {
  const loc = (document.getElementById('loc-search') as HTMLInputElement)?.value.toLowerCase() || '';
  const type = (document.getElementById('type-filter') as HTMLSelectElement)?.value || 'all';
  const min = (document.getElementById('min-price') as HTMLInputElement)?.value || '';
  const max = (document.getElementById('max-price') as HTMLInputElement)?.value || '';

  const params = new URLSearchParams();
  if (loc) params.set('loc', loc);
  if (type !== 'all') params.set('type', type);
  if (min) params.set('min', min);
  if (max) params.set('max', max);

  window.location.href = `/listings.html?${params.toString()}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const properties = await fetchProperties();
  const blogs = await fetchBlogs();

  renderProperties(properties);
  renderBlogs(blogs);
  renderFullBlogList(blogs);
  renderBlogDetail();
  renderPropertyDetail();

  document.getElementById('search-btn')?.addEventListener('click', handleSearch);
  ['loc-search', 'min-price', 'max-price'].forEach(id => {
    document.getElementById(id)?.addEventListener('keypress', (e) => {
      if ((e as KeyboardEvent).key === 'Enter') handleSearch();
    });
  });

  const investForm = document.getElementById('investment-form') as HTMLFormElement;
  if (investForm) {
    investForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newCustomer = {
        name: (document.getElementById('cust-name') as HTMLInputElement).value,
        email: (document.getElementById('cust-email') as HTMLInputElement).value,
        type: (document.getElementById('cust-type') as HTMLSelectElement).value,
        budget: (document.getElementById('cust-budget') as HTMLSelectElement).value,
        phone: (document.getElementById('cust-phone') as HTMLInputElement).value,
        notes: (document.getElementById('cust-notes') as HTMLTextAreaElement).value,
        status: 'Yeni',
        date: new Date().toLocaleDateString('tr-TR')
      };

      const { error } = await supabase.from('customers').insert([newCustomer]);
      if (error) {
        alert('Hata oluştu: ' + error.message);
      } else {
        alert('Tebrikler! Yatırım fırsatları için kaydınız başarıyla alındı.');
        investForm.reset();
      }
    });
  }

  // Mobile Menu Toggle
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');
  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const icon = mobileMenu.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
      }
    });
  }
});

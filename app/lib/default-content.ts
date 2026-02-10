import { ProfileData } from './schema';

export const renderProfile = (data: Partial<ProfileData>) => {
    const {
        fullName = "Your Name",
        tagline = "Professional Tagline",
        aboutMe = "Tell us about yourself...",
        profilePhoto = "https://cdn.mygrid.club/media/eemf6Wctnw89SoWZ1716925946.jpg",
        topHighlights = ["Highlight 1", "Highlight 2", "Highlight 3"],
        professionalTitle = "Professional Title",
        expertiseAreas = ["Expertise 1", "Expertise 2", "Expertise 3"],
        socialLinks = {},
        brands = [],
        impactHeadline = "Impact Created",
        impactStory = "Describe your impact here...",
        awards = [],
        contact = { emailPrimary: "email@example.com", phonePrimary: "+91 00000 00000", website: "www.yoursite.com" }
    } = data;

    return `
<div class="page" id="page1">
    <div class="page-1-content">
        <div class="header-container">
            <div class="profile-photo">
                <img src="${profilePhoto}" alt="${fullName}">
            </div>

            <div class="profile-details">
                <h1 class="name">${fullName}</h1>
                <div class="title">${professionalTitle || tagline}</div>

                <ul class="stats-list">
                    ${topHighlights.map(h => `<li>${h}</li>`).join('')}
                </ul>

                <div class="social-links">
                    ${socialLinks.linkedin ? `<a href="${socialLinks.linkedin}" class="social-icon"><i class="fa-brands fa-linkedin"></i></a>` : ''}
                    ${socialLinks.instagram ? `<a href="${socialLinks.instagram}" class="social-icon"><i class="fa-brands fa-instagram"></i></a>` : ''}
                    ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" class="social-icon"><i class="fa-brands fa-x-twitter"></i></a>` : ''}
                    ${socialLinks.website ? `<a href="${socialLinks.website}" class="website">${socialLinks.website.replace(/^https?:\/\//, '')}</a>` : ''}
                </div>
            </div>
        </div>

        <div class="prompt-box">
            <div class="prompt-text">
                ${aboutMe}
            </div>
        </div>

        <div class="roles-section">
            <div class="section-title">KEY ROLES AND EXPERTISE</div>
            <div class="roles-grid">
                ${expertiseAreas.map(exp => `
                <div class="role-card">
                    <div class="role-icon"><i class="fa-solid fa-check-circle"></i></div>
                    <div class="role-title">${exp}</div>
                </div>
                `).join('')}
            </div>
        </div>

        <div class="brands-section">
            <div class="brands-title">BRANDS WORKED</div>
            <div class="brands-logos">
                ${brands.map(b => `<div class="logo-placeholder">${b.name}</div>`).join('')}
                                ${brands.length === 0 ? '<div class="logo-placeholder">Brand A</div><div class="logo-placeholder">Brand B</div>' : ''}
            </div>
        </div>
    </div>
</div>

<!-- PAGE 2 -->
<div class="page" id="page2">
    <div class="page-2-content">
        <div class="section-box impact-section">
            <div class="section-header impact-header">IMPACT AND OUTREACH</div>
            
            <div class="impact-text-wrapper">
                <h3 class="highlight-blue">${impactHeadline}</h3>
                <p>${impactStory}</p>
            </div>
        </div>

        <div class="section-box awards-section">
            <div class="section-header awards-header">AWARDS AND RECOGNITION</div>

            <ul class="awards-list">
                ${awards.map(a => `<li><span class="bold-green">${a.title} (${a.year}):</span> By ${a.organization}</li>`).join('')}
                ${awards.length === 0 ? '<li>No awards listed yet.</li>' : ''}
            </ul>

            <div class="award-badge-icon">
                <i class="fa-solid fa-award"></i>
            </div>
        </div>

        <div class="section-box contact-section">
            <div class="contact-grid">
                <div class="contact-item">
                    <i class="fa-solid fa-mobile-screen contact-icon"></i>
                    <div class="contact-text">${contact.phonePrimary || 'N/A'}</div>
                </div>
                <div class="contact-item">
                    <i class="fa-regular fa-envelope contact-icon"></i>
                    <div class="contact-text">${contact.emailPrimary || 'N/A'}</div>
                </div>
                <div class="contact-item">
                    <i class="fa-solid fa-globe contact-icon"></i>
                    <div class="contact-text">${socialLinks.website || 'N/A'}</div>
                </div>
            </div>
        </div>
    </div>
</div>
`;
};

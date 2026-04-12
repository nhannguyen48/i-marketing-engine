/**
 * AI Marketing Engine - Dashboard Sync Bridge v1.0
 * Reads brand-identity.json and exports a browser-compatible config.
 */

const fs = require('fs');
const path = require('path');

// Paths
const BRAND_DATA_PATH = path.join(__dirname, '../../brands/nhan-tam/brand-identity.json');
const DASHBOARD_CONFIG_PATH = path.join(__dirname, '../../assets/js/dashboard-config.js');

function sync() {
    console.log('--- Syncing Dashboard Config ---');
    
    // 1. Read Brand Identity
    if (!fs.existsSync(BRAND_DATA_PATH)) {
        console.error('Error: brand-identity.json not found at', BRAND_DATA_PATH);
        return;
    }
    
    const brandData = JSON.parse(fs.readFileSync(BRAND_DATA_PATH, 'utf8'));
    const social = brandData.social_media || {};
    
    // 2. Format for Browser
    const config = {
        facebook: {
            pageId: social.facebook?.page_id || '',
            accessToken: social.facebook?.access_token || '',
            live: !!social.facebook?.access_token && social.facebook.access_token !== 'REPLACE_WITH_PAGE_ACCESS_TOKEN'
        },
        brand: {
            name: brandData.brand_name || 'Nhân Tâm',
            primaryColor: brandData.visual_identity?.colors?.primary || '#3E6145'
        }
    };
    
    // 3. Write JS File
    const jsContent = `/** AUTO-GENERATED - DO NOT EDIT **/
window.DASHBOARD_CONFIG = ${JSON.stringify(config, null, 4)};`;

    // Ensure directory exists
    const dir = path.dirname(DASHBOARD_CONFIG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    fs.writeFileSync(DASHBOARD_CONFIG_PATH, jsContent);
    console.log('✅ Dashboard Config synced to:', DASHBOARD_CONFIG_PATH);
    
    if (config.facebook.live) {
        console.log('🚀 Facebook API is LIVE.');
    } else {
        console.warn('⚠️ Facebook API is in MOCK mode (Missing Token).');
    }
}

sync();

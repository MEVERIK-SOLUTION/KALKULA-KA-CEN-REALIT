// ============================
// REALITY KALKULAČKA PRO - ENHANCED VERSION
// MEVERIK SOLUTION
// ============================

// Global state management
const AppState = {
    currentProject: {
        id: null,
        name: 'Nový Projekt',
        created: new Date().toISOString(),
        properties: [],
        company: {
            name: 'MEVERIK SOLUTION s.r.o.',
            ico: '',
            address: '',
            contact: ''
        },
        notes: ''
    },
    currentTab: 'project',
    currentProperty: null,
    isLoading: false,
    cadastralCache: new Map(),
    priceHistory: new Map()
};

// Enhanced pricing data with historical context
const PricingData = {
    regions: {
        'praha': { name: 'Praha', multiplier: 1.8, growth: 0.06 },
        'brno': { name: 'Brno', multiplier: 1.3, growth: 0.05 },
        'ostrava': { name: 'Ostrava', multiplier: 0.9, growth: 0.04 },
        'plzen': { name: 'Plzeň', multiplier: 1.1, growth: 0.045 },
        'liberec': { name: 'Liberec', multiplier: 0.95, growth: 0.04 },
        'default': { name: 'Ostatní', multiplier: 1.0, growth: 0.04 }
    },
    
    propertyTypes: {
        'rodinny': { 
            name: 'Rodinný dům', 
            basePrice: 45000, 
            factors: { condition: 1.2, location: 1.1, utilities: 1.05 }
        },
        'byt': { 
            name: 'Byt', 
            basePrice: 52000, 
            factors: { condition: 1.15, location: 1.2, utilities: 1.03 }
        },
        'bytovy': { 
            name: 'Bytový dům', 
            basePrice: 38000, 
            factors: { condition: 1.1, location: 1.05, utilities: 1.08 }
        },
        'komercni': { 
            name: 'Komerční', 
            basePrice: 35000, 
            factors: { condition: 1.05, location: 1.3, utilities: 1.1 }
        },
        'pozemek': { 
            name: 'Pozemek', 
            basePrice: 2500, 
            factors: { condition: 1.0, location: 1.4, utilities: 1.2 }
        },
        'ostatni': { 
            name: 'Ostatní', 
            basePrice: 25000, 
            factors: { condition: 1.0, location: 1.0, utilities: 1.0 }
        }
    },

    // Historical price data (last 3 years)
    getHistoricalPrice(type, region, year) {
        const currentYear = new Date().getFullYear();
        const basePrice = this.propertyTypes[type]?.basePrice || 35000;
        const regionData = this.regions[region] || this.regions.default;
        const yearDiff = currentYear - year;
        
        // Apply historical growth backwards
        const historicalPrice = basePrice * regionData.multiplier * Math.pow(1 + regionData.growth, -yearDiff);
        return Math.round(historicalPrice);
    },

    // Future price projection
    getFuturePrice(type, region, yearsAhead) {
        const basePrice = this.propertyTypes[type]?.basePrice || 35000;
        const regionData = this.regions[region] || this.regions.default;
        
        const futurePrice = basePrice * regionData.multiplier * Math.pow(1 + regionData.growth, yearsAhead);
        return Math.round(futurePrice);
    }
};

// Enhanced calculation engine
class PricingEngine {
    static calculatePropertyValue(property) {
        const type = property.type || 'rodinny';
        const area = parseFloat(property.area) || 0;
        const landArea = parseFloat(property.landArea) || 0;
        const condition = property.condition || 'avg';
        const zone = property.zone || 'B';
        
        // Get base price
        const typeData = PricingData.propertyTypes[type];
        if (!typeData) return { error: 'Neznámý typ nemovitosti' };
        
        let basePrice = typeData.basePrice;
        
        // Apply condition factor
        const conditionFactors = {
            'new': 1.15,
            'reno': 1.08,
            'avg': 1.0,
            'old': 0.85
        };
        basePrice *= conditionFactors[condition] || 1.0;
        
        // Apply zone factor
        const zoneFactors = {
            'A': 1.2,
            'B': 1.05,
            'C': 1.0,
            'D': 0.9
        };
        basePrice *= zoneFactors[zone] || 1.0;
        
        // Calculate total value
        const effectiveArea = type === 'pozemek' ? landArea : area;
        const totalValue = basePrice * effectiveArea;
        
        return {
            basePrice,
            effectiveArea,
            totalValue,
            pricePerM2: basePrice,
            factors: {
                condition: conditionFactors[condition] || 1.0,
                zone: zoneFactors[zone] || 1.0
            }
        };
    }
    
    static generateValuationMethods(property) {
        const basic = this.calculatePropertyValue(property);
        if (basic.error) return basic;
        
        // Multiple valuation approaches
        const methods = {
            comparative: {
                name: 'Porovnávací metoda',
                value: basic.totalValue,
                confidence: 0.85,
                description: 'Založeno na srovnání s podobnými nemovitostmi'
            },
            cost: {
                name: 'Nákladová metoda',
                value: basic.totalValue * 1.1,
                confidence: 0.75,
                description: 'Založeno na nákladech na výstavbu'
            },
            income: {
                name: 'Výnosová metoda',
                value: basic.totalValue * 0.95,
                confidence: 0.7,
                description: 'Založeno na potenciálním výnosu z pronájmu'
            }
        };
        
        // Calculate weighted average
        const totalWeight = Object.values(methods).reduce((sum, method) => sum + method.confidence, 0);
        const weightedValue = Object.values(methods).reduce((sum, method) => 
            sum + (method.value * method.confidence), 0) / totalWeight;
        
        return {
            ...basic,
            methods,
            recommendedValue: Math.round(weightedValue),
            confidence: totalWeight / Object.keys(methods).length
        };
    }
}

// Cadastral API integration (mock implementation)
class CadastralAPI {
    static async searchByParcel(parcelNumber, territory) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock cadastral data
        const mockData = {
            parcelNumber,
            territory,
            address: `${territory}, parcela ${parcelNumber}`,
            area: Math.floor(Math.random() * 2000) + 500,
            landUse: 'zastavěné území',
            owner: 'Soukromá osoba',
            restrictions: [],
            coordinates: {
                lat: 49.7437 + (Math.random() - 0.5) * 0.1,
                lng: 15.3386 + (Math.random() - 0.5) * 0.1
            }
        };
        
        return mockData;
    }
    
    static async getMapData(coordinates) {
        // Mock map data
        return {
            mapUrl: `https://api.mapy.cz/img?x=${coordinates.lng}&y=${coordinates.lat}&z=15&size=400x300`,
            cadastralUrl: `https://nahlizenidokn.cuzk.cz/MapaIdentifikace.aspx?&x=${coordinates.lng}&y=${coordinates.lat}`
        };
    }
}

// Chart management
class ChartManager {
    static createTrendChart(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const { years, values } = data;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set up dimensions
        const padding = { top: 20, right: 20, bottom: 40, left: 60 };
        const chartWidth = canvas.width - padding.left - padding.right;
        const chartHeight = canvas.height - padding.top - padding.bottom;
        
        // Find min/max values
        const minValue = Math.min(...values) * 0.9;
        const maxValue = Math.max(...values) * 1.1;
        
        // Helper functions
        const getX = (index) => padding.left + (index / (years.length - 1)) * chartWidth;
        const getY = (value) => padding.top + (1 - (value - minValue) / (maxValue - minValue)) * chartHeight;
        
        // Draw grid
        ctx.strokeStyle = 'var(--border)';
        ctx.lineWidth = 1;
        
        // Vertical grid lines
        for (let i = 0; i < years.length; i++) {
            const x = getX(i);
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + chartHeight);
            ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let i = 0; i <= 4; i++) {
            const y = padding.top + (i / 4) * chartHeight;
            ctx.beginPath();
            ctx.moveTo(padding.left, y);
            ctx.lineTo(padding.left + chartWidth, y);
            ctx.stroke();
        }
        
        // Draw line
        ctx.strokeStyle = 'var(--primary)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        values.forEach((value, index) => {
            const x = getX(index);
            const y = getY(value);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        values.forEach((value, index) => {
            const x = getX(index);
            const y = getY(value);
            
            ctx.fillStyle = 'var(--primary)';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = 'var(--text)';
        ctx.font = '12px var(--font-family)';
        ctx.textAlign = 'center';
        
        // Year labels
        years.forEach((year, index) => {
            if (index % 2 === 0) { // Show every other year
                const x = getX(index);
                ctx.fillText(year.toString(), x, canvas.height - 10);
            }
        });
        
        // Value labels
        ctx.textAlign = 'right';
        const formatValue = (value) => `${Math.round(value / 1000)}k`;
        ctx.fillText(formatValue(maxValue), padding.left - 10, padding.top + 5);
        ctx.fillText(formatValue(minValue), padding.left - 10, padding.top + chartHeight);
    }
    
    static generatePriceHistory(property) {
        const currentYear = new Date().getFullYear();
        const years = [];
        const values = [];
        
        // Generate 5 years of historical data
        for (let i = -3; i <= 2; i++) {
            const year = currentYear + i;
            years.push(year);
            
            if (i <= 0) {
                // Historical data
                const price = PricingData.getHistoricalPrice(
                    property.type || 'rodinny',
                    'default',
                    year
                );
                values.push(price * (parseFloat(property.area) || 100));
            } else {
                // Future projection
                const price = PricingData.getFuturePrice(
                    property.type || 'rodinny',
                    'default',
                    i
                );
                values.push(price * (parseFloat(property.area) || 100));
            }
        }
        
        return { years, values };
    }
}

// UI Management
class UIManager {
    static showLoading(message = 'Načítám data...') {
        const overlay = document.getElementById('loadingOverlay');
        const text = overlay.querySelector('p');
        if (text) text.textContent = message;
        overlay.classList.add('active');
        AppState.isLoading = true;
    }
    
    static hideLoading() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.remove('active');
        AppState.isLoading = false;
    }
    
    static showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    static hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    static switchTab(tabId) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[href="#${tabId}"]`)?.classList.add('active');
        
        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabId)?.classList.add('active');
        
        AppState.currentTab = tabId;
        
        // Update URL hash
        window.location.hash = tabId;
    }
    
    static updateProjectStats() {
        const propertyCount = AppState.currentProject.properties.length;
        const totalValue = AppState.currentProject.properties.reduce((sum, property) => {
            const valuation = PricingEngine.calculatePropertyValue(property);
            return sum + (valuation.totalValue || 0);
        }, 0);
        
        document.getElementById('propertyCount').textContent = propertyCount;
        document.getElementById('totalValue').textContent = this.formatCurrency(totalValue);
        document.getElementById('projectName').textContent = AppState.currentProject.name;
    }
    
    static formatCurrency(amount) {
        return new Intl.NumberFormat('cs-CZ', {
            style: 'currency',
            currency: 'CZK',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }
    
    static formatNumber(number) {
        return new Intl.NumberFormat('cs-CZ').format(number);
    }
    
    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Property management
class PropertyManager {
    static addProperty(propertyData) {
        const property = {
            id: Date.now().toString(),
            created: new Date().toISOString(),
            ...propertyData
        };
        
        AppState.currentProject.properties.push(property);
        this.renderPropertiesList();
        UIManager.updateProjectStats();
        UIManager.showNotification('Nemovitost byla přidána', 'success');
        
        return property;
    }
    
    static updateProperty(propertyId, updates) {
        const index = AppState.currentProject.properties.findIndex(p => p.id === propertyId);
        if (index !== -1) {
            AppState.currentProject.properties[index] = {
                ...AppState.currentProject.properties[index],
                ...updates,
                updated: new Date().toISOString()
            };
            this.renderPropertiesList();
            UIManager.updateProjectStats();
            UIManager.showNotification('Nemovitost byla aktualizována', 'success');
        }
    }
    
    static deleteProperty(propertyId) {
        const index = AppState.currentProject.properties.findIndex(p => p.id === propertyId);
        if (index !== -1) {
            AppState.currentProject.properties.splice(index, 1);
            this.renderPropertiesList();
            UIManager.updateProjectStats();
            UIManager.showNotification('Nemovitost byla smazána', 'success');
        }
    }
    
    static renderPropertiesList() {
        const container = document.getElementById('propertiesList');
        if (!container) return;
        
        if (AppState.currentProject.properties.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-home"></i>
                    <h3>Žádné nemovitosti</h3>
                    <p>Přidejte první nemovitost do projektu</p>
                    <button class="btn btn-primary" onclick="PropertyManager.showAddPropertyModal()">
                        <i class="fas fa-plus"></i>
                        Přidat Nemovitost
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = AppState.currentProject.properties.map(property => {
            const valuation = PricingEngine.generateValuationMethods(property);
            const typeLabel = PricingData.propertyTypes[property.type]?.name || property.type;
            
            return `
                <div class="property-card" data-property-id="${property.id}">
                    <div class="property-header">
                        <div>
                            <div class="property-title">${property.address || 'Bez adresy'}</div>
                            <div class="property-type">${typeLabel}</div>
                        </div>
                        <div class="property-actions">
                            <button class="btn btn-outline" onclick="PropertyManager.editProperty('${property.id}')">
                                <i class="fas fa-edit"></i>
                                Upravit
                            </button>
                            <button class="btn btn-outline" onclick="PropertyManager.deleteProperty('${property.id}')">
                                <i class="fas fa-trash"></i>
                                Smazat
                            </button>
                        </div>
                    </div>
                    
                    <div class="property-details">
                        <div class="property-detail">
                            <div class="property-detail-label">Plocha</div>
                            <div class="property-detail-value">${property.area || 0} m²</div>
                        </div>
                        <div class="property-detail">
                            <div class="property-detail-label">Pozemek</div>
                            <div class="property-detail-value">${property.landArea || 0} m²</div>
                        </div>
                        <div class="property-detail">
                            <div class="property-detail-label">Stav</div>
                            <div class="property-detail-value">${this.getConditionLabel(property.condition)}</div>
                        </div>
                        <div class="property-detail">
                            <div class="property-detail-label">Zóna</div>
                            <div class="property-detail-value">${property.zone || 'B'}</div>
                        </div>
                    </div>
                    
                    <div class="property-price">
                        <div class="property-price-label">Odhadovaná hodnota</div>
                        <div class="property-price-value">${UIManager.formatCurrency(valuation.recommendedValue || 0)}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    static getConditionLabel(condition) {
        const labels = {
            'new': 'Novostavba',
            'reno': 'Po rekonstrukci',
            'avg': 'Standard',
            'old': 'Původní stav'
        };
        return labels[condition] || 'Standard';
    }
    
    static showAddPropertyModal() {
        AppState.currentProperty = null;
        this.resetPropertyForm();
        UIManager.showModal('propertyModal');
    }
    
    static editProperty(propertyId) {
        const property = AppState.currentProject.properties.find(p => p.id === propertyId);
        if (property) {
            AppState.currentProperty = property;
            this.populatePropertyForm(property);
            UIManager.showModal('propertyModal');
        }
    }
    
    static resetPropertyForm() {
        document.getElementById('propertyAddress').value = '';
        document.getElementById('cadastralNumber').value = '';
        document.getElementById('cadastralTerritory').value = '';
        document.getElementById('propertyType').value = 'rodinny';
        document.getElementById('propertyArea').value = '';
        document.getElementById('landArea').value = '';
        document.getElementById('propertyCondition').value = 'avg';
        document.getElementById('propertyZone').value = 'B';
        document.getElementById('propertyNotes').value = '';
    }
    
    static populatePropertyForm(property) {
        document.getElementById('propertyAddress').value = property.address || '';
        document.getElementById('cadastralNumber').value = property.cadastralNumber || '';
        document.getElementById('cadastralTerritory').value = property.cadastralTerritory || '';
        document.getElementById('propertyType').value = property.type || 'rodinny';
        document.getElementById('propertyArea').value = property.area || '';
        document.getElementById('landArea').value = property.landArea || '';
        document.getElementById('propertyCondition').value = property.condition || 'avg';
        document.getElementById('propertyZone').value = property.zone || 'B';
        document.getElementById('propertyNotes').value = property.notes || '';
    }
    
    static saveProperty() {
        const propertyData = {
            address: document.getElementById('propertyAddress').value,
            cadastralNumber: document.getElementById('cadastralNumber').value,
            cadastralTerritory: document.getElementById('cadastralTerritory').value,
            type: document.getElementById('propertyType').value,
            area: document.getElementById('propertyArea').value,
            landArea: document.getElementById('landArea').value,
            condition: document.getElementById('propertyCondition').value,
            zone: document.getElementById('propertyZone').value,
            notes: document.getElementById('propertyNotes').value
        };
        
        if (AppState.currentProperty) {
            this.updateProperty(AppState.currentProperty.id, propertyData);
        } else {
            this.addProperty(propertyData);
        }
        
        UIManager.hideModal('propertyModal');
    }
    
    static async searchCadastral() {
        const parcelNumber = document.getElementById('searchCadastral').value.trim();
        if (!parcelNumber) {
            UIManager.showNotification('Zadejte parcelní číslo a obec', 'error');
            return;
        }
        
        UIManager.showLoading('Vyhledávám v katastru...');
        
        try {
            // Parse input (expecting format like "123/4 Město")
            const parts = parcelNumber.split(' ');
            const parcel = parts[0];
            const territory = parts.slice(1).join(' ') || 'Neznámé území';
            
            const data = await CadastralAPI.searchByParcel(parcel, territory);
            
            // Populate form with cadastral data
            document.getElementById('propertyAddress').value = data.address;
            document.getElementById('cadastralNumber').value = data.parcelNumber;
            document.getElementById('cadastralTerritory').value = data.territory;
            document.getElementById('landArea').value = data.area;
            
            // Show results
            const resultsDiv = document.getElementById('cadastralResults');
            resultsDiv.innerHTML = `
                <div class="cadastral-result">
                    <h5>Nalezeno v katastru:</h5>
                    <p><strong>Adresa:</strong> ${data.address}</p>
                    <p><strong>Výměra:</strong> ${data.area} m²</p>
                    <p><strong>Využití:</strong> ${data.landUse}</p>
                    <p><strong>Vlastník:</strong> ${data.owner}</p>
                </div>
            `;
            
            UIManager.showNotification('Data načtena z katastru', 'success');
        } catch (error) {
            UIManager.showNotification('Chyba při vyhledávání v katastru', 'error');
            console.error('Cadastral search error:', error);
        } finally {
            UIManager.hideLoading();
        }
    }
}

// Data management (Import/Export)
class DataManager {
    static exportProject() {
        const exportData = {
            version: '4.0',
            exported: new Date().toISOString(),
            project: AppState.currentProject
        };
        
        return JSON.stringify(exportData, null, 2);
    }
    
    static importProject(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Validate data structure
            if (!data.project) {
                throw new Error('Neplatný formát dat');
            }
            
            // Handle different versions
            if (data.version && data.version.startsWith('3.')) {
                // Convert from v3 format
                data.project = this.convertFromV3(data);
            }
            
            AppState.currentProject = {
                ...AppState.currentProject,
                ...data.project,
                imported: new Date().toISOString()
            };
            
            // Update UI
            this.updateProjectForm();
            PropertyManager.renderPropertiesList();
            UIManager.updateProjectStats();
            
            UIManager.showNotification('Projekt byl úspěšně importován', 'success');
            return true;
        } catch (error) {
            UIManager.showNotification('Chyba při importu: ' + error.message, 'error');
            console.error('Import error:', error);
            return false;
        }
    }
    
    static convertFromV3(oldData) {
        // Convert old format to new format
        const converted = {
            name: oldData.basic?.location || 'Importovaný projekt',
            properties: [],
            company: {
                name: oldData.company?.name || '',
                ico: oldData.company?.ico || '',
                address: oldData.company?.address || '',
                contact: oldData.company?.contact || ''
            },
            notes: oldData.basic?.notes || ''
        };
        
        // Convert single property from old format
        if (oldData.property) {
            converted.properties.push({
                id: Date.now().toString(),
                address: oldData.basic?.location || '',
                type: oldData.property.type || 'rodinny',
                area: oldData.property.area || 0,
                landArea: oldData.property.land || 0,
                condition: oldData.property.condition || 'avg',
                zone: oldData.property.zone || 'B',
                notes: oldData.mode?.recText || ''
            });
        }
        
        return converted;
    }
    
    static updateProjectForm() {
        document.getElementById('projectNameInput').value = AppState.currentProject.name;
        document.getElementById('projectDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('companyName').value = AppState.currentProject.company.name;
        document.getElementById('companyIco').value = AppState.currentProject.company.ico;
        document.getElementById('companyAddress').value = AppState.currentProject.company.address;
        document.getElementById('projectNotes').value = AppState.currentProject.notes;
    }
    
    static saveProjectData() {
        AppState.currentProject.name = document.getElementById('projectNameInput').value;
        AppState.currentProject.company.name = document.getElementById('companyName').value;
        AppState.currentProject.company.ico = document.getElementById('companyIco').value;
        AppState.currentProject.company.address = document.getElementById('companyAddress').value;
        AppState.currentProject.notes = document.getElementById('projectNotes').value;
        
        UIManager.updateProjectStats();
        UIManager.showNotification('Projekt byl uložen', 'success');
    }
    
    static downloadJSON() {
        const data = this.exportProject();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${AppState.currentProject.name.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        UIManager.showNotification('JSON soubor byl stažen', 'success');
    }
    
    static loadJSONFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.importProject(e.target.result);
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
}

// Report generation
class ReportGenerator {
    static generateSummaryReport() {
        const project = AppState.currentProject;
        const totalValue = project.properties.reduce((sum, property) => {
            const valuation = PricingEngine.calculatePropertyValue(property);
            return sum + (valuation.totalValue || 0);
        }, 0);
        
        const report = `
            <div class="report-header">
                <h1>Souhrnný Report Ocenění</h1>
                <div class="report-meta">
                    <p><strong>Projekt:</strong> ${project.name}</p>
                    <p><strong>Datum:</strong> ${new Date().toLocaleDateString('cs-CZ')}</p>
                    <p><strong>Společnost:</strong> ${project.company.name}</p>
                </div>
            </div>
            
            <div class="report-summary">
                <h2>Přehled projektu</h2>
                <div class="summary-grid">
                    <div class="summary-item">
                        <span class="summary-label">Počet nemovitostí:</span>
                        <span class="summary-value">${project.properties.length}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Celková hodnota:</span>
                        <span class="summary-value">${UIManager.formatCurrency(totalValue)}</span>
                    </div>
                    <div class="summary-item">
                        <span class="summary-label">Průměrná hodnota:</span>
                        <span class="summary-value">${UIManager.formatCurrency(totalValue / (project.properties.length || 1))}</span>
                    </div>
                </div>
            </div>
            
            <div class="report-properties">
                <h2>Detail nemovitostí</h2>
                ${project.properties.map(property => this.generatePropertySection(property)).join('')}
            </div>
            
            <div class="report-footer">
                <p>Report vygenerován aplikací Reality Kalkulačka Pro - MEVERIK SOLUTION</p>
                <p>Datum: ${new Date().toLocaleString('cs-CZ')}</p>
            </div>
        `;
        
        return report;
    }
    
    static generatePropertySection(property) {
        const valuation = PricingEngine.generateValuationMethods(property);
        const typeLabel = PricingData.propertyTypes[property.type]?.name || property.type;
        
        return `
            <div class="property-section">
                <h3>${property.address || 'Bez adresy'}</h3>
                <div class="property-info">
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Typ:</span>
                            <span class="info-value">${typeLabel}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Plocha:</span>
                            <span class="info-value">${property.area || 0} m²</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Pozemek:</span>
                            <span class="info-value">${property.landArea || 0} m²</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Stav:</span>
                            <span class="info-value">${PropertyManager.getConditionLabel(property.condition)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="valuation-methods">
                    <h4>Metody ocenění</h4>
                    <table class="valuation-table">
                        <thead>
                            <tr>
                                <th>Metoda</th>
                                <th>Hodnota</th>
                                <th>Spolehlivost</th>
                                <th>Popis</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(valuation.methods || {}).map(([key, method]) => `
                                <tr>
                                    <td>${method.name}</td>
                                    <td>${UIManager.formatCurrency(method.value)}</td>
                                    <td>${Math.round(method.confidence * 100)}%</td>
                                    <td>${method.description}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <div class="recommended-value">
                        <strong>Doporučená hodnota: ${UIManager.formatCurrency(valuation.recommendedValue || 0)}</strong>
                    </div>
                </div>
            </div>
        `;
    }
    
    static showReportModal(reportContent) {
        document.getElementById('reportContent').innerHTML = reportContent;
        UIManager.showModal('reportModal');
    }
    
    static printReport() {
        window.print();
    }
    
    static downloadReportPDF() {
        UIManager.showNotification('PDF export bude dostupný v plné verzi', 'info');
    }
}

// Analysis tools
class AnalysisManager {
    static updateAnalysis() {
        this.updatePriceChart();
        this.updateRegionalComparison();
        this.updateInvestmentMetrics();
    }
    
    static updatePriceChart() {
        if (AppState.currentProject.properties.length === 0) return;
        
        // Use first property for demo
        const property = AppState.currentProject.properties[0];
        const chartData = ChartManager.generatePriceHistory(property);
        ChartManager.createTrendChart('priceChart', chartData);
    }
    
    static updateRegionalComparison() {
        const container = document.getElementById('regionComparison');
        if (!container) return;
        
        const regions = [
            { name: 'Praha', price: 85000, change: '+5.2%' },
            { name: 'Brno', price: 62000, change: '+3.8%' },
            { name: 'Ostrava', price: 45000, change: '+2.1%' },
            { name: 'Plzeň', price: 52000, change: '+4.1%' }
        ];
        
        container.innerHTML = regions.map(region => `
            <div class="region-item">
                <div>
                    <strong>${region.name}</strong>
                    <span class="region-price">${UIManager.formatCurrency(region.price)}/m²</span>
                </div>
                <div class="region-change ${region.change.startsWith('+') ? 'positive' : 'negative'}">
                    ${region.change}
                </div>
            </div>
        `).join('');
    }
    
    static updateInvestmentMetrics() {
        if (AppState.currentProject.properties.length === 0) {
            document.getElementById('roiValue').textContent = '-';
            document.getElementById('paybackValue').textContent = '-';
            document.getElementById('irrValue').textContent = '-';
            document.getElementById('capRateValue').textContent = '-';
            return;
        }
        
        // Calculate basic investment metrics
        const totalValue = AppState.currentProject.properties.reduce((sum, property) => {
            const valuation = PricingEngine.calculatePropertyValue(property);
            return sum + (valuation.totalValue || 0);
        }, 0);
        
        // Mock calculations for demo
        const roi = ((totalValue * 0.06) / totalValue * 100).toFixed(1);
        const payback = (totalValue / (totalValue * 0.06)).toFixed(1);
        const irr = (6.5).toFixed(1);
        const capRate = (5.8).toFixed(1);
        
        document.getElementById('roiValue').textContent = `${roi}%`;
        document.getElementById('paybackValue').textContent = `${payback} let`;
        document.getElementById('irrValue').textContent = `${irr}%`;
        document.getElementById('capRateValue').textContent = `${capRate}%`;
    }
}

// Event handlers
function initializeEventHandlers() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('href').substring(1);
            UIManager.switchTab(tabId);
        });
    });
    
    // Project form
    document.getElementById('projectNameInput')?.addEventListener('input', (e) => {
        AppState.currentProject.name = e.target.value;
        UIManager.updateProjectStats();
    });
    
    // Property management
    document.getElementById('addPropertyBtn')?.addEventListener('click', PropertyManager.showAddPropertyModal);
    document.getElementById('addNewPropertyBtn')?.addEventListener('click', PropertyManager.showAddPropertyModal);
    document.getElementById('savePropertyBtn')?.addEventListener('click', PropertyManager.saveProperty);
    document.getElementById('cancelPropertyBtn')?.addEventListener('click', () => UIManager.hideModal('propertyModal'));
    
    // Cadastral search
    document.getElementById('searchCadastralBtn')?.addEventListener('click', PropertyManager.searchCadastral);
    document.getElementById('cadastralSearchBtn')?.addEventListener('click', () => {
        document.getElementById('searchCadastral').focus();
    });
    
    // Import/Export
    document.getElementById('importBtn')?.addEventListener('click', () => UIManager.showModal('importExportModal'));
    document.getElementById('exportBtn')?.addEventListener('click', DataManager.downloadJSON);
    document.getElementById('loadJsonBtn')?.addEventListener('click', DataManager.loadJSONFile);
    document.getElementById('exportJsonBtn')?.addEventListener('click', DataManager.downloadJSON);
    
    // Reports
    document.getElementById('generateReportBtn')?.addEventListener('click', () => {
        const report = ReportGenerator.generateSummaryReport();
        ReportGenerator.showReportModal(report);
    });
    document.getElementById('generateSummaryBtn')?.addEventListener('click', () => {
        const report = ReportGenerator.generateSummaryReport();
        ReportGenerator.showReportModal(report);
    });
    document.getElementById('printReportBtn')?.addEventListener('click', ReportGenerator.printReport);
    document.getElementById('downloadReportBtn')?.addEventListener('click', ReportGenerator.downloadReportPDF);
    
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                UIManager.hideModal(modal.id);
            }
        });
    });
    
    // Modal background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                UIManager.hideModal(modal.id);
            }
        });
    });
    
    // Import/Export tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabId = e.target.dataset.tab;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            // Update tab content
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabId)?.classList.add('active');
        });
    });
    
    // Auto-save project data
    ['projectNameInput', 'companyName', 'companyIco', 'companyAddress', 'projectNotes'].forEach(id => {
        document.getElementById(id)?.addEventListener('blur', DataManager.saveProjectData);
    });
}

// Initialize application
function initializeApp() {
    // Set current date
    document.getElementById('projectDate').value = new Date().toISOString().split('T')[0];
    
    // Initialize UI
    UIManager.updateProjectStats();
    PropertyManager.renderPropertiesList();
    AnalysisManager.updateAnalysis();
    
    // Set initial tab from URL hash or default
    const initialTab = window.location.hash.substring(1) || 'project';
    UIManager.switchTab(initialTab);
    
    // Initialize event handlers
    initializeEventHandlers();
    
    // Generate sample trend chart
    const sampleData = ChartManager.generatePriceHistory({ type: 'rodinny', area: 120 });
    ChartManager.createTrendChart('trendChart', sampleData);
    
    console.log('Reality Kalkulačka Pro initialized successfully');
}

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle browser back/forward
window.addEventListener('popstate', () => {
    const tabId = window.location.hash.substring(1) || 'project';
    UIManager.switchTab(tabId);
});

// Add CSS for notifications
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        padding: var(--space-4);
        box-shadow: var(--shadow-lg);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: var(--space-3);
    }
    
    .notification-success {
        border-left: 4px solid var(--olive);
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-info {
        border-left: 4px solid var(--gray);
    }
    
    .empty-state {
        text-align: center;
        padding: var(--space-12);
        color: var(--text-muted);
    }
    
    .empty-state i {
        font-size: var(--font-size-3xl);
        margin-bottom: var(--space-4);
        opacity: 0.5;
    }
    
    .empty-state h3 {
        font-size: var(--font-size-xl);
        margin-bottom: var(--space-2);
        color: var(--text);
    }
    
    .empty-state p {
        margin-bottom: var(--space-6);
    }
    
    .cadastral-result {
        background: var(--accent);
        border: 1px solid var(--border);
        border-radius: var(--radius);
        padding: var(--space-4);
        margin-top: var(--space-3);
    }
    
    .cadastral-result h5 {
        color: var(--primary-dark);
        margin-bottom: var(--space-2);
    }
    
    .cadastral-result p {
        margin-bottom: var(--space-1);
        font-size: var(--font-size-sm);
    }
    
    .region-change.positive {
        color: var(--olive);
    }
    
    .region-change.negative {
        color: #ef4444;
    }
    
    .summary-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--space-4);
        margin: var(--space-6) 0;
    }
    
    .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-4);
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: var(--radius);
    }
    
    .summary-label {
        color: var(--text-muted);
        font-size: var(--font-size-sm);
    }
    
    .summary-value {
        font-weight: 600;
        color: var(--text);
    }
    
    .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: var(--space-3);
        margin: var(--space-4) 0;
    }
    
    .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--space-2);
        background: var(--background);
        border-radius: var(--radius-sm);
    }
    
    .info-label {
        color: var(--text-muted);
        font-size: var(--font-size-sm);
    }
    
    .info-value {
        font-weight: 500;
        color: var(--text);
    }
    
    .valuation-table {
        width: 100%;
        border-collapse: collapse;
        margin: var(--space-4) 0;
    }
    
    .valuation-table th,
    .valuation-table td {
        padding: var(--space-3);
        text-align: left;
        border-bottom: 1px solid var(--border);
    }
    
    .valuation-table th {
        background: var(--gray-light);
        font-weight: 600;
        color: var(--text);
    }
    
    .recommended-value {
        text-align: center;
        padding: var(--space-4);
        background: var(--accent);
        border-radius: var(--radius);
        margin-top: var(--space-4);
        font-size: var(--font-size-lg);
        color: var(--primary-dark);
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
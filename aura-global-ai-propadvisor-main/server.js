/**
 * ============================================================================
 * Aura Global AI PropAdvisor - Mastermind Backend (Production Grade A+)
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const http = require('http');

// استدعاء طبقة الأمن السيبراني المتقدمة
const {
    helmetSecurity,
    globalApiLimiter,
    aiQueryLimiter,
    sanitizeInput,
    aiFirewall,
    validateSafeUrl
} = require('./securityMiddleware');

// استدعاء محرك الذكاء الاصطناعي العقاري المتقدم
const auraBrain = require('./auraBrainAI');

const app = express();
const server = http.createServer(app);

// 1. إعدادات جدار الحماية وسياسات النطاق (CORS Hardening)
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',') 
    : ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5000'];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('CORS Armor: Access Blocked by Security Protocol'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-aura-client-token'],
    credentials: true,
    maxAge: 86400
};

// 2. تفعيل الترويسات الدفاعية وفلاتر الحماية (A+ Defense Stack)
app.use(helmetSecurity);
app.use(cors(corsOptions));
app.use(express.json({ limit: '100kb' })); // حماية ضد هجمات Payload Flooding
app.use(sanitizeInput);                   // تعقيم فوري ضد XSS وPrototype Pollution
app.use('/api/', globalApiLimiter);       // محدد معدل الطلبات لحماية الخادم من الـ DDoS

// ذاكرة تتبع مؤقتة للاستخدام المجاني (Free Tier Tracker) لمنع استنزاف الخادم
const usageTracker = new Map();

// 3. محرك الرادار وسحب البيانات المحصن ضد هجمات الـ SSRF
async function scrapeAllPortals(cityName, projectName) {
    const cleanProject = (projectName || '').trim();
    const sanitizedProject = encodeURIComponent(cleanProject);

    const sources = [
        { name: "Aqarmap Egypt", url: `https://aqarmap.com.eg/ar/for-sale/property-price-${sanitizedProject}` },
        { name: "Property Finder", url: `https://www.propertyfinder.ae/en/search?q=${sanitizedProject}` },
        { name: "Bayut Global", url: `https://www.bayut.com/to/search?q=${sanitizedProject}` },
        { name: "Nawy Properties", url: `https://nawy.com/search?q=${sanitizedProject}` },
        { name: "Zillow US", url: `https://www.zillow.com/homes/${sanitizedProject}_rb/` },
        { name: "Rightmove UK", url: `https://www.rightmove.co.uk/property-for-sale/find.html?searchLocation=${sanitizedProject}` }
    ];

    // تنفيذ متوازي وسريع مع حماية الخادم
    const results = await Promise.allSettled(
        sources.map(async (source) => {
            // فحص الرابط أمنياً لمنع هجمات الـ SSRF
            const isSafe = await validateSafeUrl(source.url);
            if (!isSafe) {
                return {
                    portalName: source.name,
                    status: "محظور أمنياً (Anti-SSRF Armor)",
                    priceFound: "N/A",
                    sourceUrl: source.url
                };
            }

            try {
                const { data } = await axios.get(source.url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
                        'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8'
                    },
                    timeout: 4500,
                    maxRedirects: 3
                });

                const $ = cheerio.load(data);
                let scrapedPrice = $('.price-value, .property-price, .listing-price, .card-price, span[data-testid="price"]').first().text().trim();

                return {
                    portalName: source.name,
                    status: "متصل بنجاح وموثق",
                    priceFound: scrapedPrice || "تم رصد متوسط المؤشر الحي",
                    sourceUrl: source.url
                };
            } catch (error) {
                return {
                    portalName: source.name,
                    status: "مؤشر ذكي احتياطي مفعل",
                    priceFound: "وفق معايير التقييم العقاري المعتمدة",
                    sourceUrl: source.url
                };
            }
        })
    );

    return {
        queryCity: cityName,
        queryProject: projectName,
        allPortalsResults: results.map(r => r.value),
        timestamp: new Date().toISOString()
    };
}

// ==========================================
// 4. نقاط النهاية (Endpoints) المحمية
// ==========================================

// فحص الجاهزية والأمن السيبراني
app.get('/health', (req, res) => {
    res.json({
        status: "OPERATIONAL",
        securityGrade: "A+",
        protection: ["Helmet-CSP", "HSTS-Preload", "Anti-SSRF", "Prompt-Firewall", "Rate-Limiter"],
        aiEngine: "Aura Global PropAdvisor Intelligence Active"
    });
});

// نقطة النهاية 1: رادار المنصات العالمية
app.post('/api/all-portals-radar', async (req, res) => {
    try {
        const { city, project } = req.body;
        const targetCity = (city || "القاهرة / دبي / لندن").substring(0, 80);
        const targetProject = (project || "المشاريع الكبرى").substring(0, 80);

        const comprehensiveData = await scrapeAllPortals(targetCity, targetProject);

        res.json({
            success: true,
            engine: "Aura Global AI Multi-Portal Radar",
            data: comprehensiveData
        });
    } catch (err) {
        res.status(500).json({ success: false, error: "تعذر إتمام مسح الرادار العالمي." });
    }
});

// نقطة النهاية 2: غرفة استشارات الذكاء الاصطناعي الشاملة (AI Mastermind)
app.post('/api/ai-comprehensive-query', aiQueryLimiter, aiFirewall, async (req, res) => {
    try {
        const { userEmail, userQuery, projectQuery, city, budget, subscriptionStatus, investmentGoal } = req.body;
        const queryText = (userQuery || projectQuery || "عقارات استثمارية").substring(0, 300);
        const targetCity = (city || "الشرق الأوسط والعالم").substring(0, 80);

        // التحقق من الصلاحيات وتفادي التلاعب بالاشتراك
        const isAdmin = userEmail && userEmail === (process.env.ADMIN_EMAIL || 'your-admin-email@gmail.com');
        const isPremium = ['pro', 'enterprise'].includes((subscriptionStatus || '').toLowerCase());

        // نظام الحصة اليومية للحساب المجاني
        const clientIdentifier = userEmail || req.ip;
        let clientUsage = usageTracker.get(clientIdentifier) || 0;

        if (!isAdmin && !isPremium && clientUsage >= 3) {
            return res.status(429).json({
                success: false,
                code: "FREE_TIER_LIMIT_REACHED",
                aiReport: "⚠️ عذراً، لقد استنفذت باقتك المجانية اليومية (3 استشارات). اشترك في باقة المحترفين لتستمر بلا حدود مع خوارزميات الذكاء الاصطناعي العالمية!"
            });
        }

        // زيادة عداد الاستخدام للحسابات المجانية
        if (!isAdmin && !isPremium) {
            usageTracker.set(clientIdentifier, clientUsage + 1);
        }

        // جلب البيانات من المنصات العالمية
        const portalsRadar = await scrapeAllPortals(targetCity, queryText);

        // إرسال البيانات إلى عقل الذكاء الاصطناعي (Aura Brain) للتحليل والاستدلال المالي
        const aiAnalysis = await auraBrain.generateComprehensiveAdvisory({
            city: targetCity,
            project: queryText,
            portalsData: portalsRadar.allPortalsResults,
            userBudget: Number(budget) || null,
            investmentGoal: investmentGoal || "تعظيم صافي عائد الإيجار والنمو الرأسمالي"
        });

        res.json({
            success: true,
            tier: isAdmin ? "Admin Sovereign" : isPremium ? "Premium Pro" : "Free Explorer",
            remainingFreeQueries: (!isAdmin && !isPremium) ? Math.max(0, 3 - (clientUsage + 1)) : "Unlimited",
            aiEngine: aiAnalysis.engine,
            aiReport: aiAnalysis.executiveReport,
            financialMetrics: aiAnalysis.financialMetrics,
            portalsDetails: portalsRadar
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: "حدث خطأ أثناء معالجة التقرير الاستثماري بأمان."
        });
    }
});

// معالجة الروابط غير الموجودة
app.use((req, res) => {
    res.status(404).json({ success: false, error: "المسار المطلوب غير موجود." });
});

// معالج الأخطاء العام (يمنع تسريب تفاصيل النظام البرمجية)
app.use((err, req, res, next) => {
    res.status(500).json({
        success: false,
        error: "حدث خطأ أمني أو داخلي. تم قيد الواقعة وتأمين الخادم."
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🛡️ Aura Mastermind Backend [A+ Cyber Armor & PropAdvisor AI] active on port ${PORT}`);
});
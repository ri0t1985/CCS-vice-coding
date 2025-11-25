// Fruit Personality Quiz with World-Changing Features

// Global Statistics (would be fetched from server in production)
const globalStats = {
    totalQuizzesTaken: 0,
    personalityDistribution: {
        banana: 0,
        apple: 0,
        lemon: 0
    },
    impactStats: {
        treesPlanted: 0,
        waterSaved: 0,
        carbonReduced: 0
    }
};

const quizQuestions = [
    {
        question: "How do you usually start your day?",
        options: [
            { text: "With lots of energy", personality: "banana", impact: "energyConscious" },
            { text: "Taking it slow and steady", personality: "apple", impact: "localProduce" },
            { text: "With a zesty attitude", personality: "lemon", impact: "waterSaving" }
        ],
        fact: "Did you know? The way you start your day can affect your food choices and environmental impact!"
    },
    {
        question: "What's your ideal weekend activity?",
        options: [
            { text: "Sports and outdoor activities", personality: "banana", impact: "activeLifestyle" },
            { text: "Reading a book in the garden", personality: "apple", impact: "sustainableLiving" },
            { text: "Hosting a party", personality: "lemon", impact: "socialImpact" }
        ],
        fact: "Fun fact: Outdoor activities can reduce your carbon footprint compared to indoor entertainment!"
    },
    {
        question: "How would your friends describe you?",
        options: [
            { text: "Energetic and fun", personality: "banana", impact: "communityEngagement" },
            { text: "Reliable and wise", personality: "apple", impact: "mentorship" },
            { text: "Bold and refreshing", personality: "lemon", impact: "innovation" }
        ],
        fact: "Did you know? Your personality type can influence your environmental awareness!"
    },
    {
        question: "What's your approach to environmental challenges?",
        options: [
            { text: "Taking immediate action", personality: "banana", impact: "directAction" },
            { text: "Planning sustainable solutions", personality: "apple", impact: "longTermPlanning" },
            { text: "Inspiring others to change", personality: "lemon", impact: "socialInfluence" }
        ],
        fact: "Amazing fact: Individual actions, when multiplied, create significant environmental impact!"
    }
];

const fruitPersonalities = {
    banana: {
        name: "Energetic Banana",
        description: "You're full of energy and always ready for adventure! Like a banana, you provide instant vitality and bring joy to those around you.",
        recommendations: ["Healthy Mix Bundle", "Tropical Party Bundle"],
        healthBenefits: [
            "Natural energy booster",
            "Rich in potassium for heart health",
            "Perfect pre-workout snack"
        ],
        environmentalImpact: {
            positive: "Bananas are one of the most efficient fruits in terms of water usage per calorie!",
            action: "By choosing organic bananas, you support sustainable farming practices."
        },
        seasonalTip: getCurrentSeasonTip('banana')
    },
    apple: {
        name: "Wise Apple",
        description: "You're dependable and bring wisdom to every situation. Like an apple, you're a classic choice that never goes out of style.",
        recommendations: ["Healthy Mix Bundle", "Fruit Feast Bundle"],
        healthBenefits: [
            "Rich in antioxidants",
            "Supports gut health",
            "Natural blood sugar regulation"
        ],
        environmentalImpact: {
            positive: "Apple trees help combat climate change by absorbing CO2!",
            action: "Supporting local apple orchards reduces transportation emissions."
        },
        seasonalTip: getCurrentSeasonTip('apple')
    },
    lemon: {
        name: "Zesty Lemon",
        description: "You bring a fresh perspective and aren't afraid to stand out! Like a lemon, you add excitement to any situation.",
        recommendations: ["Citrus Lovers Bundle", "Fruit Feast Bundle"],
        healthBenefits: [
            "Boosts immune system",
            "Natural detoxifier",
            "Supports skin health"
        ],
        environmentalImpact: {
            positive: "Lemon trees are excellent air purifiers!",
            action: "Using whole lemons reduces food waste and maximizes environmental benefits."
        },
        seasonalTip: getCurrentSeasonTip('lemon')
    }
};

let currentQuestion = 0;
let personalityScores = {
    banana: 0,
    apple: 0,
    lemon: 0
};
let impactScore = 0;

function getCurrentSeasonTip(fruit) {
    const season = getCurrentSeason();
    const tips = {
        banana: {
            spring: "Perfect time for smoothies!",
            summer: "Great for outdoor picnics!",
            fall: "Add to your morning routine!",
            winter: "Ideal indoor ripening season!"
        },
        apple: {
            spring: "Try last season's storage apples!",
            summer: "Early varieties are coming!",
            fall: "Peak apple season - buy local!",
            winter: "Perfect for warm apple dishes!"
        },
        lemon: {
            spring: "Add to spring detox water!",
            summer: "Make fresh lemonade!",
            fall: "Great for immune system!",
            winter: "Peak citrus season!"
        }
    };
    return tips[fruit][season];
}

function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
}

function startQuiz() {
    currentQuestion = 0;
    personalityScores = { banana: 0, apple: 0, lemon: 0 };
    impactScore = 0;
    displayQuestion();
    document.getElementById('quiz-start').style.display = 'none';
    document.getElementById('quiz-questions').style.display = 'block';
    document.getElementById('quiz-result').style.display = 'none';
}

function displayQuestion() {
    const questionContainer = document.getElementById('quiz-questions');
    const question = quizQuestions[currentQuestion];
    
    questionContainer.innerHTML = `
        <h3>Question ${currentQuestion + 1} of ${quizQuestions.length}</h3>
        <p class="question">${question.question}</p>
        <div class="fun-fact">${question.fact}</div>
        <div class="options">
            ${question.options.map((option, index) => `
                <button onclick="selectOption('${option.personality}', '${option.impact}')" class="quiz-option">
                    ${option.text}
                </button>
            `).join('')}
        </div>
        <div class="quiz-progress">
            <div class="progress-bar" style="width: ${(currentQuestion + 1) / quizQuestions.length * 100}%"></div>
        </div>
    `;
}

function selectOption(personality, impact) {
    personalityScores[personality]++;
    impactScore += calculateImpactScore(impact);
    
    if (currentQuestion < quizQuestions.length - 1) {
        currentQuestion++;
        displayQuestion();
    } else {
        updateGlobalStats();
        showResult();
    }
}

function calculateImpactScore(impact) {
    const impactScores = {
        energyConscious: 10,
        localProduce: 15,
        waterSaving: 12,
        activeLifestyle: 8,
        sustainableLiving: 20,
        socialImpact: 15,
        communityEngagement: 18,
        mentorship: 15,
        innovation: 12,
        directAction: 20,
        longTermPlanning: 18,
        socialInfluence: 15
    };
    return impactScores[impact] || 0;
}

function updateGlobalStats() {
    globalStats.totalQuizzesTaken++;
    const result = Object.entries(personalityScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    globalStats.personalityDistribution[result]++;
    
    // Simulate environmental impact (would be real calculations in production)
    globalStats.impactStats.treesPlanted += Math.floor(impactScore / 50);
    globalStats.impactStats.waterSaved += impactScore * 2;
    globalStats.impactStats.carbonReduced += impactScore / 10;
}

function showResult() {
    const result = Object.entries(personalityScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const personality = fruitPersonalities[result];
    const resultContainer = document.getElementById('quiz-result');
    
    document.getElementById('quiz-questions').style.display = 'none';
    resultContainer.style.display = 'block';
    
    resultContainer.innerHTML = `
        <h2>Your Fruit Personality: ${personality.name}!</h2>
        <p class="personality-description">${personality.description}</p>
        
        <div class="impact-section">
            <h3>🌍 Your Environmental Impact</h3>
            <p>${personality.environmentalImpact.positive}</p>
            <p class="impact-action">👉 ${personality.environmentalImpact.action}</p>
            <div class="impact-stats">
                <div class="impact-stat">
                    <span class="impact-number">+${Math.floor(impactScore / 50)}</span>
                    <span class="impact-label">Trees Worth</span>
                </div>
                <div class="impact-stat">
                    <span class="impact-number">${impactScore * 2}L</span>
                    <span class="impact-label">Water Saved</span>
                </div>
                <div class="impact-stat">
                    <span class="impact-number">${(impactScore / 10).toFixed(1)}kg</span>
                    <span class="impact-label">CO₂ Reduced</span>
                </div>
            </div>
        </div>

        <div class="health-section">
            <h3>💪 Health Benefits</h3>
            <ul>
                ${personality.healthBenefits.map(benefit => `
                    <li>${benefit}</li>
                `).join('')}
            </ul>
        </div>

        <div class="seasonal-section">
            <h3>🌱 Seasonal Tip</h3>
            <p>${personality.seasonalTip}</p>
        </div>

        <div class="recommendations">
            <h3>🎁 Recommended Bundles for You:</h3>
            <ul>
                ${personality.recommendations.map(bundle => `
                    <li><a href="bundles.html">${bundle}</a></li>
                `).join('')}
            </ul>
        </div>

        <div class="global-impact">
            <h3>🌎 Join the Global Fruit Movement</h3>
            <p>You're part of a community making a difference!</p>
            <div class="global-stats">
                <div class="stat">
                    <span class="number">${globalStats.totalQuizzesTaken}</span>
                    <span class="label">Quizzes Taken</span>
                </div>
                <div class="stat">
                    <span class="number">${globalStats.impactStats.treesPlanted}</span>
                    <span class="label">Trees Impact</span>
                </div>
                <div class="stat">
                    <span class="number">${Math.floor(globalStats.impactStats.waterSaved)}L</span>
                    <span class="label">Water Saved</span>
                </div>
            </div>
        </div>

        <div class="share-section">
            <h3>📢 Share Your Impact</h3>
            <p>Inspire others to join the sustainable fruit movement!</p>
            <div class="share-buttons">
                <button onclick="shareResult('twitter')" class="share-button twitter">Share on Twitter</button>
                <button onclick="shareResult('facebook')" class="share-button facebook">Share on Facebook</button>
            </div>
        </div>

        <button onclick="startQuiz()" class="retry-button">Take Quiz Again</button>
    `;
}

function shareResult(platform) {
    const result = Object.entries(personalityScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    const personality = fruitPersonalities[result];
    const shareText = `I'm a ${personality.name} 🌟 Making a positive impact through sustainable fruit choices! Take the quiz to discover your fruit personality and environmental impact! 🌍🍎🍌🍋 #FruitPersonality #Sustainability`;
    
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`
    };
    
    window.open(shareUrls[platform], '_blank');
} 
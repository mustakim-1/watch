/**
 * Lucky Spin Feature
 * Functionality:
 * 1. Creates a modal with a spinning wheel
 * 2. Handles the spin logic and animation
 * 3. Saves rewards to localStorage
 * 4. Applies discounts if valid
 */

const LUCKY_SPIN_STYLES = `
.ls-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.ls-modal-overlay.active {
    opacity: 1;
    visibility: visible;
}

.ls-modal-content {
    background: linear-gradient(135deg, #1a1a1a, #0d0d0d);
    border: 1px solid rgba(212, 175, 55, 0.3);
    border-radius: 20px;
    padding: 30px;
    position: relative;
    max-width: 500px;
    width: 90%;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    transform: scale(0.9) translateY(20px);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.ls-modal-overlay.active .ls-modal-content {
    transform: scale(1) translateY(0);
}

.ls-close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    background: none;
    border: none;
    color: #666;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.3s;
}

.ls-close-btn:hover {
    color: #fff;
}

.ls-title {
    font-family: 'Playfair Display', serif;
    color: #d4af37;
    font-size: 2rem;
    margin-bottom: 10px;
}

.ls-subtitle {
    color: #a0a0a0;
    margin-bottom: 30px;
    font-size: 0.9rem;
}

.ls-wheel-container {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 0 auto 30px;
}

.ls-wheel {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 4px solid #d4af37;
    background: #1a1a1a;
    position: relative;
    overflow: hidden;
    transition: transform 5s cubic-bezier(0.2, 0.8, 0.1, 1);
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.2);
}

.ls-wheel-section {
    position: absolute;
    width: 50%;
    height: 50%;
    transform-origin: 100% 100%;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

.ls-wheel-section:nth-child(odbox-shadowd) {
    background: rgba(212, 175, 55, 0.1);
}

.ls-wheel-label {
    position: absolute;
    left: 50%;
    top: 50%;
    transform-origin: 0 0;
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    white-space: nowrap;
}

.ls-pointer {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
    background: #d4af37;
    clip-path: polygon(50% 100%, 0 0, 100% 0);
    z-index: 10;
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));
}

.ls-spin-btn {
    background: linear-gradient(45deg, #d4af37, #b8860b);
    color: #0d0d0d;
    border: none;
    padding: 15px 40px;
    border-radius: 50px;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
}

.ls-spin-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(212, 175, 55, 0.4);
}

.ls-spin-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.ls-result-message {
    margin-top: 20px;
    min-height: 24px;
    font-weight: 600;
    color: #d4af37;
    opacity: 0;
    transition: opacity 0.5s;
}

/* Confetti Effect */
.confetti {
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: #f00;
    animation: fall linear forwards;
}

@keyframes fall {
    to {
        transform: translateY(100vh) rotate(720deg);
    }
}
`;

const PRIZES = [
    { id: 1, label: '5% OFF', value: 5, type: 'discount', probability: 0.4, code: 'OFF5' },
    { id: 2, label: 'Free Ship', value: 200, type: 'shipping', probability: 0.3, code: 'SHIPFREE' },
    { id: 3, label: '10% OFF', value: 10, type: 'discount', probability: 0.15, code: 'OFF10' },
    { id: 4, label: 'Better Luck', value: 0, type: 'none', probability: 0.1, code: null },
    { id: 5, label: '15% OFF', value: 15, type: 'discount', probability: 0.05, code: 'OFF15' }
];

class LuckySpin {
    constructor() {
        this.enabled = true;
        this.hasSpun = this.checkIfSpun();
        this.injectStyles();
        this.createModal();
    }

    checkIfSpun() {
        // Reset spin every 24 hours
        const lastSpin = localStorage.getItem('dialcraft_last_spin');
        if (!lastSpin) return false;

        const now = new Date().getTime();
        const diff = now - parseInt(lastSpin);
        return diff < 24 * 60 * 60 * 1000;
    }

    injectStyles() {
        if (!document.getElementById('lucky-spin-styles')) {
            const style = document.createElement('style');
            style.id = 'lucky-spin-styles';
            style.textContent = LUCKY_SPIN_STYLES;
            document.head.appendChild(style);
        }
    }

    createModal() {
        const modalHTML = `
            <div class="ls-modal-overlay" id="ls-modal">
                <div class="ls-modal-content">
                    <button class="ls-close-btn" onclick="luckySpin.close()">&times;</button>
                    <h2 class="ls-title">Daily Lucky Spin</h2>
                    <p class="ls-subtitle">Spin the wheel to win exclusive discounts and rewards!</p>
                    
                    <div class="ls-wheel-container">
                        <div class="ls-pointer"></div>
                        <div class="ls-wheel" id="ls-wheel">
                            <!-- Wheel gets generated here -->
                        </div>
                    </div>

                    <button class="ls-spin-btn" id="ls-spin-btn" onclick="luckySpin.spin()">
                        ${this.hasSpun ? 'Come Back Tomorrow' : 'SPIN NOW'}
                    </button>
                    <div class="ls-result-message" id="ls-result"></div>
                </div>
            </div>
        `;

        const existing = document.getElementById('ls-modal');
        if (existing) existing.remove();

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        if (this.hasSpun) {
            document.getElementById('ls-spin-btn').disabled = true;
        }

        this.drawWheel();
    }

    drawWheel() {
        const wheel = document.getElementById('ls-wheel');
        const segmentAngle = 360 / PRIZES.length;

        // Use conic-gradient for segments
        let conicSegments = [];
        PRIZES.forEach((prize, index) => {
            const start = index * segmentAngle;
            const end = (index + 1) * segmentAngle;
            // visual alternating colors
            const color = index % 2 === 0 ? '#1a1a1a' : '#222';
            conicSegments.push(`${color} ${start}deg ${end}deg`);

            // Add text label
            const label = document.createElement('div');
            label.className = 'ls-wheel-label';
            const midAngle = start + segmentAngle / 2;
            // Position magic: rotate to angle, translate out, rotate back
            label.style.transform = `
                translate(-50%, -50%)
                rotate(${midAngle}deg)
                translateY(-80px)
                rotate(-${midAngle + 90}deg)
            `;
            label.textContent = prize.label;
            // Fix rotation for readability
            if (midAngle > 90 && midAngle < 270) {
                label.style.transform = `
                    translate(-50%, -50%)
                    rotate(${midAngle}deg)
                    translateY(-80px)
                    rotate(-${midAngle + 90 + 180}deg)
                `;
            }
            wheel.appendChild(label);
        });

        // Background via conic gradient
        wheel.style.background = `conic-gradient(${conicSegments.join(', ')})`;
    }

    open() {
        document.getElementById('ls-modal').classList.add('active');
    }

    close() {
        document.getElementById('ls-modal').classList.remove('active');
    }

    spin() {
        if (this.hasSpun) return;

        const btn = document.getElementById('ls-spin-btn');
        btn.disabled = true;
        btn.textContent = 'Spinning...';

        // Weighted random selection
        const rand = Math.random();
        let cumulative = 0;
        let selectedPrizeIndex = 0;

        for (let i = 0; i < PRIZES.length; i++) {
            cumulative += PRIZES[i].probability;
            if (rand <= cumulative) {
                selectedPrizeIndex = i;
                break;
            }
        }

        const selectedPrize = PRIZES[selectedPrizeIndex];
        const wheel = document.getElementById('ls-wheel');

        // Calculate rotation
        const segmentAngle = 360 / PRIZES.length;
        // Add random full rotations (5-10)
        const rotations = 360 * (5 + Math.floor(Math.random() * 5));
        // Target the center of the segment
        const stopAngle = (selectedPrizeIndex * segmentAngle) + (segmentAngle / 2);
        // We spin CLOCKWISE, so to land on index i, we need to rotate BACKWARDS or offset
        // Actually simplest is: pointer is at 0 (top).
        // If we rotate wheel by -X degrees, index X is at top.
        // Let's just calculate required rotation.
        // To align segment center with top (0deg):
        // current pos is rotation. New rotation should be such that segment is at 0.
        // 0 = current_rotation + segment_center_offset
        // rotation = -segment_center_offset

        const finalRotation = rotations - stopAngle;

        wheel.style.transform = `rotate(${finalRotation}deg)`;

        // Handle result
        setTimeout(() => {
            this.handleWin(selectedPrize);
        }, 5000); // 5s matches CSS transition
    }

    handleWin(prize) {
        const resultDiv = document.getElementById('ls-result');
        const btn = document.getElementById('ls-spin-btn');
        
        // Ensure user exists
        const user = this.getOrCreateUser();

        // Save spin state
        localStorage.setItem('dialcraft_last_spin', new Date().getTime());
        this.hasSpun = true;

        if (prize.type === 'none') {
            resultDiv.textContent = 'Maybe next time! Tomorrow brings new luck.';
            btn.textContent = 'Try Again Tomorrow';
        } else {
            resultDiv.textContent = `You won: ${prize.label}!`;
            btn.textContent = 'Claimed!';
            this.createConfetti();
            this.saveCoupon(prize, user.id);
        }

        resultDiv.style.opacity = '1';

        // Add to account rewards history
        this.saveRewardToAccount(prize, user.id);
    }

    getOrCreateUser() {
        let user = null;
        const currentUserId = localStorage.getItem('current_user_id');
        if (currentUserId) {
            const users = JSON.parse(localStorage.getItem('dialcraft_users')) || [];
            user = users.find(u => u.id === currentUserId);
        }
        
        if (!user) {
            user = JSON.parse(localStorage.getItem('dialcraft_user'));
        }
        
        if (!user) {
            user = { 
                id: 'guest_' + Date.now(),
                name: 'Guest User',
                email: '',
                tier: 'Standard'
            };
            localStorage.setItem('dialcraft_user', JSON.stringify(user));
        }
        return user;
    }

    saveCoupon(prize, userId) {
        let coupons = JSON.parse(localStorage.getItem('dialcraft_coupons')) || [];
        // Add new coupon
        coupons.push({
            userId: userId,
            code: prize.code,
            percent: prize.value,
            expiry: new Date().getTime() + (7 * 24 * 60 * 60 * 1000), // 7 days
            used: false
        });
        localStorage.setItem('dialcraft_coupons', JSON.stringify(coupons));

        // Also save to active cart session if nice
        localStorage.setItem('dialcraft_active_discount', JSON.stringify({
            code: prize.code,
            percent: prize.value,
            type: prize.type
        }));
    }

    saveRewardToAccount(prize, userId) {
        let rewards = JSON.parse(localStorage.getItem('dialcraft_spin_rewards')) || [];
        rewards.push({
            userId: userId,
            label: prize.label,
            time: new Date().getTime(),
            couponCode: prize.code
        });
        localStorage.setItem('dialcraft_spin_rewards', JSON.stringify(rewards));
    }

    createConfetti() {
        const colors = ['#d4af37', '#b8860b', '#fff', '#f00'];
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = Math.random() * 2 + 3 + 's';
            confetti.style.top = '-10px';
            document.body.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }
    }
}

// Initialize
const luckySpin = new LuckySpin();

// Expose open function globally
window.openLuckySpin = () => luckySpin.open();

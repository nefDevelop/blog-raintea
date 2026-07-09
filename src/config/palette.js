// Semilla y armonía por defecto
import { hexToHsl, hslToHex } from './colorUtils';

export const PALETTE_SEED = '#FF7800';
export const HARMONY = 'tonal';

/**
 * Deriva secondary, tertiary, neutral desde un color semilla.
 * Misma lógica que DesignSystemLab/stores.js
 */
export function derivePalette(hex, harmony = HARMONY) {
	const hsl = hexToHsl(hex);
	if (!hsl) return { primary: hex, secondary: hex, tertiary: hex, neutral: hex };

	let secondary, tertiary, neutral;

	switch (harmony) {
		case 'tonal':
			secondary = hslToHex(hsl.h, Math.max(10, hsl.s * 0.4), hsl.l);
			tertiary = hslToHex((hsl.h + 60) % 360, Math.max(20, hsl.s * 0.6), hsl.l);
			neutral = hslToHex(hsl.h, 8, 45);
			break;
		case 'analogous':
			secondary = hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l);
			tertiary = hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);
			neutral = hslToHex(hsl.h, 5, 50);
			break;
		case 'triadic':
			secondary = hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l);
			tertiary = hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l);
			neutral = hslToHex(hsl.h, 5, 50);
			break;
		case 'complementary':
			secondary = hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
			tertiary = hslToHex((hsl.h + 180) % 360, hsl.s * 0.5, hsl.l + 10);
			neutral = hslToHex(hsl.h, 5, 50);
			break;
		default:
			secondary = hslToHex(hsl.h, Math.max(10, hsl.s * 0.4), hsl.l);
			tertiary = hslToHex((hsl.h + 60) % 360, Math.max(20, hsl.s * 0.6), hsl.l);
			neutral = hslToHex(hsl.h, 8, 45);
	}

	return { primary: hex, secondary, tertiary, neutral };
}

/**
 * Genera colores de UI (fondos, textos) según modo.
 * Misma lógica que stores.js
 */
export function deriveUIColors(hex, dark = false) {
	const hsl = hexToHsl(hex);
	if (!hsl) {
		return {
			bg: dark ? '#0a0a0b' : '#f5f5f0',
			cardBg: dark ? '#1a1a1e' : '#ffffff',
			textMain: dark ? '#ffffff' : '#18181b',
			textMuted: dark ? '#a1a1aa' : '#71717a',
		};
	}

	if (dark) {
		return {
			bg: hslToHex(hsl.h, Math.min(20, hsl.s), 10),
			cardBg: hslToHex(hsl.h, Math.min(10, hsl.s), 15),
			textMain: '#ffffff',
			textMuted: '#a1a1aa',
		};
	}

	return {
		bg: hslToHex(hsl.h, Math.min(30, hsl.s), 90),
		cardBg: hslToHex(hsl.h, Math.min(15, hsl.s), 97),
		textMain: '#18181b',
		textMuted: '#71717a',
	};
}

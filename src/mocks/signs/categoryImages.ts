// Real hand sign illustrations for each category
// Generated via Stable Diffusion - hands making Brazilian Sign Language (LIBRAS) gestures

export const CATEGORY_IMAGES: Record<string, string> = {
  'Família':
    'https://readdy.ai/api/search-image?query=A%20pair%20of%20hands%20making%20Brazilian%20Sign%20Language%20LIBRAS%20family%20sign%20gesture%2C%20hands%20forming%20a%20home%20shape%20together%20with%20fingers%20interlaced%2C%20warm%20skin%20tones%20on%20clean%20simple%20light%20beige%20background%2C%20soft%20studio%20lighting%2C%20photographic%20educational%20illustration%20style%2C%20high%20detail%2C%20professional%20sign%20language%20learning%20material&width=600&height=600&seq=101&orientation=squarish',
  'Saudações':
    'https://readdy.ai/api/search-image?query=A%20hand%20making%20Brazilian%20Sign%20Language%20LIBRAS%20greeting%20gesture%2C%20open%20palm%20touching%20the%20cheek%20warmly%20in%20saudacao%20sign%2C%20warm%20skin%20tones%20on%20clean%20simple%20light%20cream%20background%2C%20soft%20studio%20lighting%2C%20photographic%20educational%20illustration%2C%20high%20detail%2C%20professional%20sign%20language%20learning%20material&width=600&height=600&seq=102&orientation=squarish',
  'Emoções':
    'https://readdy.ai/api/search-image?query=Two%20hands%20making%20Brazilian%20Sign%20Language%20LIBRAS%20emotion%20sign%2C%20hands%20placed%20over%20the%20heart%20area%20showing%20love%20and%20feelings%20gesture%2C%20warm%20skin%20tones%20on%20clean%20simple%20light%20peach%20background%2C%20soft%20studio%20lighting%2C%20photographic%20educational%20illustration%2C%20high%20detail&width=600&height=600&seq=103&orientation=squarish',
  'Lugares':
    'https://readdy.ai/api/search-image?query=Hands%20making%20Brazilian%20Sign%20Language%20LIBRAS%20house%20or%20school%20sign%2C%20hands%20forming%20a%20roof%20shape%20with%20fingers%20touching%20at%20the%20top%2C%20warm%20skin%20tones%20on%20clean%20simple%20light%20gray%20background%2C%20soft%20studio%20lighting%2C%20photographic%20educational%20illustration%2C%20high%20detail&width=600&height=600&seq=104&orientation=squarish',
  'Alimentos':
    'https://readdy.ai/api/search-image?query=Hands%20making%20Brazilian%20Sign%20Language%20LIBRAS%20eating%20gesture%2C%20one%20hand%20cupped%20bringing%20food%20to%20the%20mouth%20in%20comer%20sign%2C%20warm%20skin%20tones%20on%20clean%20simple%20light%20mint%20background%2C%20soft%20studio%20lighting%2C%20photographic%20educational%20illustration%2C%20high%20detail&width=600&height=600&seq=105&orientation=squarish',
  'Transporte':
    'https://readdy.ai/api/search-image?query=Hands%20making%20Brazilian%20Sign%20Language%20LIBRAS%20car%20or%20driving%20sign%2C%20hands%20gripping%20an%20imaginary%20steering%20wheel%20in%20front%20of%20body%2C%20warm%20skin%20tones%20on%20clean%20simple%20light%20blue%20background%2C%20soft%20studio%20lighting%2C%20photographic%20educational%20illustration%2C%20high%20detail&width=600&height=600&seq=106&orientation=squarish',
  'Pronomes':
    'https://readdy.ai/api/search-image?query=A%20hand%20making%20Brazilian%20Sign%20Language%20LIBRAS%20pointing%20pronoun%20gesture%2C%20index%20finger%20pointing%20forward%20at%20chest%20level%2C%20warm%20skin%20tones%20on%20clean%20simple%20light%20lavender%20background%2C%20soft%20studio%20lighting%2C%20photographic%20educational%20illustration%2C%20high%20detail&width=600&height=600&seq=107&orientation=squarish',
  'Natureza':
    'https://readdy.ai/api/search-image?query=Hands%20making%20Brazilian%20Sign%20Language%20LIBRAS%20sun%20or%20nature%20sign%2C%20one%20hand%20circling%20upward%20radiating%20sunlight%20gesture%2C%20warm%20skin%20tones%20on%20clean%20simple%20light%20yellow%20background%2C%20soft%20studio%20lighting%2C%20photographic%20educational%20illustration%2C%20high%20detail&width=600&height=600&seq=108&orientation=squarish',
  'Tempo':
    'https://readdy.ai/api/search-image?query=Hands%20making%20Brazilian%20Sign%20Language%20LIBRAS%20time%20or%20week%20sign%2C%20one%20hand%20tapping%20the%20wrist%20like%20a%20watch%2C%20warm%20skin%20tones%20on%20clean%20simple%20light%20coral%20background%2C%20soft%20studio%20lighting%2C%20photographic%20educational%20illustration%2C%20high%20detail&width=600&height=600&seq=109&orientation=squarish',
  'Números':
    'https://readdy.ai/api/search-image?query=Hands%20making%20Brazilian%20Sign%20Language%20LIBRAS%20number%20or%20counting%20gesture%2C%20fingers%20extended%20showing%20count%2C%20warm%20skin%20tones%20on%20clean%20simple%20light%20pink%20background%2C%20soft%20studio%20lighting%2C%20photographic%20educational%20illustration%2C%20high%20detail&width=600&height=600&seq=110&orientation=squarish',
};

// Categories that share images with similar categories
const CATEGORY_FALLBACK_MAP: Record<string, string> = {
  'Cores': 'Números',
  'Meses': 'Tempo',
  'Semana': 'Tempo',
  'Verbos': 'Alimentos',
  'Adjetivos': 'Emoções',
  'Perguntas': 'Pronomes',
  'Animais': 'Natureza',
  'Profissões': 'Lugares',
  'Corpo': 'Família',
  'Roupas': 'Lugares',
  'Objetos': 'Transporte',
  'Materiais': 'Transporte',
  'Disciplinas': 'Lugares',
  'Vários': 'Pronomes',
};

export function getCategoryImage(category: string): string | undefined {
  if (CATEGORY_IMAGES[category]) {
    return CATEGORY_IMAGES[category];
  }
  const fallback = CATEGORY_FALLBACK_MAP[category];
  if (fallback && CATEGORY_IMAGES[fallback]) {
    return CATEGORY_IMAGES[fallback];
  }
  return undefined;
}
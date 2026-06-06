#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Relatório de Análise - LibrasVoxPro: Sinais com as Mãos Equivocados
"""

import os
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch, cm
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    PageBreak, KeepTogether, Image
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ━━ Color Palette ━━
ACCENT       = colors.HexColor('#be233d')
TEXT_PRIMARY  = colors.HexColor('#1d1f21')
TEXT_MUTED    = colors.HexColor('#757c81')
BG_SURFACE   = colors.HexColor('#e0e4e6')
BG_PAGE      = colors.HexColor('#f1f3f3')

TABLE_HEADER_COLOR = ACCENT
TABLE_HEADER_TEXT  = colors.white
TABLE_ROW_EVEN     = colors.white
TABLE_ROW_ODD      = BG_SURFACE

# ━━ Font Registration ━━
pdfmetrics.registerFont(TTFont('SarasaMonoSC', '/usr/share/fonts/truetype/chinese/SarasaMonoSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('SarasaMonoSC', '/usr/share/fonts/truetype/chinese/SarasaMonoSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('SarasaMonoSCBold', '/usr/share/fonts/truetype/chinese/SarasaMonoSC-Bold.ttf'))
pdfmetrics.registerFont(TTFont('LiberationSans', '/usr/share/fonts/truetype/chinese/LiberationSans-Regular.ttf'))
pdfmetrics.registerFont(TTFont('DejaVuSans', '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf'))

registerFontFamily('SarasaMonoSC', normal='SarasaMonoSC', bold='SarasaMonoSC')
registerFontFamily('SarasaMonoSC', normal='SarasaMonoSC', bold='SarasaMonoSCBold')
registerFontFamily('LiberationSans', normal='LiberationSans', bold='LiberationSans')

# ━━ Output ━━
OUTPUT_PDF = '/home/z/my-project/download/analise_librasvoxpro_sinais.pdf'

# ━━ Page Setup ━━
page_w, page_h = A4
left_margin = 1.0 * inch
right_margin = 1.0 * inch
top_margin = 0.8 * inch
bottom_margin = 0.8 * inch
available_width = page_w - left_margin - right_margin

doc = SimpleDocTemplate(
    OUTPUT_PDF,
    pagesize=A4,
    leftMargin=left_margin,
    rightMargin=right_margin,
    topMargin=top_margin,
    bottomMargin=bottom_margin,
)

# ━━ Styles ━━
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'CustomTitle',
    fontName='SarasaMonoSC',
    fontSize=22,
    leading=30,
    textColor=ACCENT,
    spaceBefore=24,
    spaceAfter=12,
    alignment=TA_CENTER,
)

h1_style = ParagraphStyle(
    'CustomH1',
    fontName='SarasaMonoSC',
    fontSize=18,
    leading=26,
    textColor=ACCENT,
    spaceBefore=18,
    spaceAfter=10,
)

h2_style = ParagraphStyle(
    'CustomH2',
    fontName='SarasaMonoSC',
    fontSize=14,
    leading=20,
    textColor=TEXT_PRIMARY,
    spaceBefore=14,
    spaceAfter=8,
)

h3_style = ParagraphStyle(
    'CustomH3',
    fontName='SarasaMonoSC',
    fontSize=12,
    leading=18,
    textColor=TEXT_PRIMARY,
    spaceBefore=10,
    spaceAfter=6,
)

body_style = ParagraphStyle(
    'CustomBody',
    fontName='SarasaMonoSC',
    fontSize=10.5,
    leading=18,
    textColor=TEXT_PRIMARY,
    alignment=TA_LEFT,
    spaceBefore=0,
    spaceAfter=6,
    wordWrap='CJK',
)

body_indent_style = ParagraphStyle(
    'CustomBodyIndent',
    parent=body_style,
    leftIndent=20,
)

bullet_style = ParagraphStyle(
    'BulletStyle',
    parent=body_style,
    leftIndent=24,
    bulletIndent=12,
    spaceBefore=2,
    spaceAfter=4,
)

caption_style = ParagraphStyle(
    'CaptionStyle',
    fontName='SarasaMonoSC',
    fontSize=9,
    leading=14,
    textColor=TEXT_MUTED,
    alignment=TA_CENTER,
    spaceBefore=3,
    spaceAfter=6,
)

error_style = ParagraphStyle(
    'ErrorStyle',
    parent=body_style,
    textColor=colors.HexColor('#c0392b'),
    leftIndent=12,
)

correct_style = ParagraphStyle(
    'CorrectStyle',
    parent=body_style,
    textColor=colors.HexColor('#27ae60'),
    leftIndent=12,
)

header_cell_style = ParagraphStyle(
    'HeaderCell',
    fontName='SarasaMonoSC',
    fontSize=10,
    leading=14,
    textColor=TABLE_HEADER_TEXT,
    alignment=TA_CENTER,
)

cell_style = ParagraphStyle(
    'CellStyle',
    fontName='SarasaMonoSC',
    fontSize=9.5,
    leading=14,
    textColor=TEXT_PRIMARY,
    alignment=TA_LEFT,
    wordWrap='CJK',
)

cell_center_style = ParagraphStyle(
    'CellCenterStyle',
    parent=cell_style,
    alignment=TA_CENTER,
)

# ━━ Helper Functions ━━
def make_table(data, col_widths, caption_text=None):
    """Create a styled table with optional caption."""
    t = Table(data, colWidths=col_widths, hAlign='CENTER')
    style_commands = [
        ('BACKGROUND', (0, 0), (-1, 0), TABLE_HEADER_COLOR),
        ('TEXTCOLOR', (0, 0), (-1, 0), TABLE_HEADER_TEXT),
        ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ]
    # Alternate row colors
    for i in range(1, len(data)):
        bg = TABLE_ROW_EVEN if i % 2 == 1 else TABLE_ROW_ODD
        style_commands.append(('BACKGROUND', (0, i), (-1, i), bg))
    t.setStyle(TableStyle(style_commands))
    
    elements = [Spacer(1, 18), t]
    if caption_text:
        elements.append(Spacer(1, 6))
        elements.append(Paragraph(caption_text, caption_style))
    elements.append(Spacer(1, 18))
    return elements

def P(text, style=body_style):
    return Paragraph(text, style)

# ━━ Build Story ━━
story = []

# ── Cover / Title ──
story.append(Spacer(1, 80))
story.append(P('<b>Analise do Projeto LibrasVoxPro</b>', title_style))
story.append(Spacer(1, 12))
story.append(P('Identificacao de Erros nos Sinais com as Maos', ParagraphStyle(
    'SubTitle', fontName='SarasaMonoSC', fontSize=16, leading=24,
    textColor=TEXT_MUTED, alignment=TA_CENTER, spaceAfter=24
)))
story.append(Spacer(1, 30))

# Summary box
summary_data = [
    [Paragraph('<b>Projeto</b>', cell_style), Paragraph('LibrasVoxPro (LVP)', cell_style)],
    [Paragraph('<b>Site</b>', cell_style), Paragraph('https://librasvoxpro.com.br', cell_style)],
    [Paragraph('<b>Tecnologia</b>', cell_style), Paragraph('React + Vite (SPA), Firebase, Gemini AI, Readdy.ai', cell_style)],
    [Paragraph('<b>Total de Sinais</b>', cell_style), Paragraph('210 sinais em 24 categorias + 26 letras (datilologia)', cell_style)],
    [Paragraph('<b>Problema Principal</b>', cell_style), Paragraph('Sinais com as maos equivocados', cell_style)],
    [Paragraph('<b>Data da Analise</b>', cell_style), Paragraph('7 de junho de 2026', cell_style)],
]
summary_table = Table(summary_data, colWidths=[available_width*0.3, available_width*0.7], hAlign='CENTER')
summary_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (0, -1), BG_SURFACE),
    ('GRID', (0, 0), (-1, -1), 0.5, TEXT_MUTED),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
]))
story.append(summary_table)

story.append(PageBreak())

# ══════════════════════════════════════════════════════
# SECTION 1: Visao Geral do Projeto
# ══════════════════════════════════════════════════════
story.append(P('<b>1. Visao Geral do Projeto</b>', h1_style))

story.append(P(
    'O LibrasVoxPro (LVP) e uma plataforma educacional online dedicada ao ensino da Lingua Brasileira de Sinais (Libras) com o apoio de inteligencia artificial. '
    'Construido como uma Single Page Application (SPA) com React e Vite, o projeto oferece um dicionario de 210 sinais organizados em 24 categorias, '
    'uma visualizacao 3D interativa do alfabeto manual (datilologia) com 26 letras, um assistente virtual com Gemini AI, flashcards com repeticao espacada (SRS), '
    'e uma demonstracao de reconhecimento visual de sinais por camera. O site esta hospedado em https://librasvoxpro.com.br e utiliza o Firebase como backend, '
    'com imagens geradas por IA atraves da API do Readdy.ai.'
))

story.append(P(
    'A plataforma se propoe a ser uma ferramenta completa e gratuita para o aprendizado de Libras, incluindo funcionalidades como: dicionario de sinais com descricao passo a passo, '
    'visualizacao 3D do alfabeto manual renderizada em Canvas, exercicios e quizzes academicos sobre gramatica e cultura surda, frases por contexto, '
    'um assistente IA com 4 modos especializados (Tutor, Tradutor, Pratica e Cultura Surda), e um sistema de progresso que rastreia os sinais aprendidos pelo usuario. '
    'O design e responsivo e inclui o plugin VLibras do governo federal para acessibilidade.'
))

story.append(P('<b>1.1 Tecnologias Utilizadas</b>', h2_style))

tech_data = [
    [Paragraph('<b>Categoria</b>', header_cell_style), Paragraph('<b>Tecnologia</b>', header_cell_style), Paragraph('<b>Uso</b>', header_cell_style)],
    [Paragraph('Frontend', cell_style), Paragraph('React + Vite', cell_style), Paragraph('SPA com rotas no cliente', cell_style)],
    [Paragraph('Estilizacao', cell_style), Paragraph('Tailwind CSS', cell_style), Paragraph('Design responsivo e utilidades', cell_style)],
    [Paragraph('Backend', cell_style), Paragraph('Firebase', cell_style), Paragraph('Hospedagem e dados', cell_style)],
    [Paragraph('IA Assistente', cell_style), Paragraph('Gemini AI (Google)', cell_style), Paragraph('Chat com 4 modos especializados', cell_style)],
    [Paragraph('Imagens', cell_style), Paragraph('Readdy.ai API', cell_style), Paragraph('Geracao de imagens de maos por IA', cell_style)],
    [Paragraph('Renderizacao 3D', cell_style), Paragraph('Canvas HTML5', cell_style), Paragraph('Visualizacao do alfabeto manual', cell_style)],
    [Paragraph('Acessibilidade', cell_style), Paragraph('VLibras', cell_style), Paragraph('Tradutor de portugues para Libras', cell_style)],
    [Paragraph('Voz', cell_style), Paragraph('VAPI', cell_style), Paragraph('Widget de assistente por voz', cell_style)],
]
story.extend(make_table(tech_data, [available_width*0.2, available_width*0.3, available_width*0.5],
    'Tabela 1: Stack tecnologico do LibrasVoxPro'))

story.append(P('<b>1.2 Categorias de Sinais</b>', h2_style))

story.append(P(
    'O dicionario do LVP contem 210 sinais distribuidos em 24 categorias tematicas. As categorias abrangem desde vocabulario basico (Saudacoes, Familia, Numeros, Cores) '
    'ate termos mais especificos (Disciplinas escolares, Profissoes educacionais, Lugares de instituicao). A lista completa de categorias e respectiva quantidade de sinais '
    'e apresentada na tabela abaixo. Esta organizacao permite ao usuario navegar por topicos de interesse e construir seu vocabulario de forma estruturada, '
    'partindo dos sinais mais cotidianos ate os mais especializados.'
))

cat_data = [
    [Paragraph('<b>Categoria</b>', header_cell_style), Paragraph('<b>Qtd.</b>', header_cell_style),
     Paragraph('<b>Categoria</b>', header_cell_style), Paragraph('<b>Qtd.</b>', header_cell_style)],
    [Paragraph('Saudacoes', cell_center_style), Paragraph('3', cell_center_style),
     Paragraph('Familia', cell_center_style), Paragraph('18', cell_center_style)],
    [Paragraph('Numeros', cell_center_style), Paragraph('13', cell_center_style),
     Paragraph('Cores', cell_center_style), Paragraph('8', cell_center_style)],
    [Paragraph('Pronomes', cell_center_style), Paragraph('6', cell_center_style),
     Paragraph('Alimentos', cell_center_style), Paragraph('10', cell_center_style)],
    [Paragraph('Emocoes', cell_center_style), Paragraph('7', cell_center_style),
     Paragraph('Verbos', cell_center_style), Paragraph('8', cell_center_style)],
    [Paragraph('Adjetivos', cell_center_style), Paragraph('10', cell_center_style),
     Paragraph('Perguntas', cell_center_style), Paragraph('4', cell_center_style)],
    [Paragraph('Lugares', cell_center_style), Paragraph('14', cell_center_style),
     Paragraph('Animais', cell_center_style), Paragraph('8', cell_center_style)],
    [Paragraph('Natureza', cell_center_style), Paragraph('8', cell_center_style),
     Paragraph('Transporte', cell_center_style), Paragraph('6', cell_center_style)],
    [Paragraph('Profissoes', cell_center_style), Paragraph('11', cell_center_style),
     Paragraph('Corpo', cell_center_style), Paragraph('8', cell_center_style)],
    [Paragraph('Tempo', cell_center_style), Paragraph('9', cell_center_style),
     Paragraph('Roupas', cell_center_style), Paragraph('6', cell_center_style)],
    [Paragraph('Objetos', cell_center_style), Paragraph('8', cell_center_style),
     Paragraph('Materiais', cell_center_style), Paragraph('7', cell_center_style)],
    [Paragraph('Disciplinas', cell_center_style), Paragraph('11', cell_center_style),
     Paragraph('Meses', cell_center_style), Paragraph('12', cell_center_style)],
    [Paragraph('Semana', cell_center_style), Paragraph('7', cell_center_style),
     Paragraph('Varios', cell_center_style), Paragraph('8', cell_center_style)],
]
story.extend(make_table(cat_data, [available_width*0.25, available_width*0.1, available_width*0.25, available_width*0.1],
    'Tabela 2: Distribuicao dos 210 sinais por categoria'))

story.append(PageBreak())

# ══════════════════════════════════════════════════════
# SECTION 2: Erros Identificados - Visao Geral
# ══════════════════════════════════════════════════════
story.append(P('<b>2. Erros Identificados - Visao Geral</b>', h1_style))

story.append(P(
    'A analise detalhada do codigo-fonte do LibrasVoxPro revelou problemas significativos nos sinais com as maos, divididos em tres categorias principais: '
    '(1) inconsistencias entre a homepage e o dicionario, onde o mesmo sinal e descrito de formas diferentes em paginas distintas; '
    '(2) erros nos valores de handConfig do alfabeto 3D, que controlam a renderizacao da mao no Canvas e resultam em posiciones incorretas dos dedos; '
    'e (3) descricoes equivocadas de configuracoes de mao nos passos dos sinais do dicionario, que podem ensinar o usuario de forma incorreta. '
    'Alem disso, todas as imagens dos sinais sao geradas por IA (Readdy.ai), o que introduz um risco sistematico de representacao visual imprecisa, '
    'ja que modelos de geracao de imagem frequentemente nao reproduzem fielmente as configuracoes de mao especificas da Libras.'
))

# Summary of errors table
err_summary = [
    [Paragraph('<b>Tipo de Erro</b>', header_cell_style), Paragraph('<b>Severidade</b>', header_cell_style),
     Paragraph('<b>Quantidade</b>', header_cell_style), Paragraph('<b>Impacto</b>', header_cell_style)],
    [Paragraph('Inconsistencia Homepage vs Dicionario', cell_style), Paragraph('Alto', cell_center_style),
     Paragraph('3+ sinais', cell_center_style), Paragraph('Ensino incorreto ao usuario', cell_style)],
    [Paragraph('handConfig incorreto (alfabeto 3D)', cell_style), Paragraph('Alto', cell_center_style),
     Paragraph('4 letras', cell_center_style), Paragraph('Visualizacao 3D errada', cell_style)],
    [Paragraph('Configuracao de mao errada (dicionario)', cell_style), Paragraph('Alto', cell_center_style),
     Paragraph('6 sinais', cell_center_style), Paragraph('Ensino incorreto ao usuario', cell_style)],
    [Paragraph('Imagens geradas por IA imprecisas', cell_style), Paragraph('Medio', cell_center_style),
     Paragraph('Todos os sinais', cell_center_style), Paragraph('Referencia visual duvidosa', cell_style)],
    [Paragraph('Ausencia de videos reais para alguns sinais', cell_style), Paragraph('Medio', cell_center_style),
     Paragraph('Muitos sinais', cell_center_style), Paragraph('Falta de modelo visual confiavel', cell_style)],
]
story.extend(make_table(err_summary, [available_width*0.3, available_width*0.12, available_width*0.15, available_width*0.43],
    'Tabela 3: Resumo dos erros identificados'))

# ══════════════════════════════════════════════════════
# SECTION 3: Inconsistencias Homepage vs Dicionario
# ══════════════════════════════════════════════════════
story.append(P('<b>3. Inconsistencias entre Homepage e Dicionario</b>', h1_style))

story.append(P(
    'A homepage do LibrasVoxPro exibe 8 sinais em destaque num carrossel, cada um com uma breve descricao e dica de configuracao de mao. '
    'No entanto, ao navegar para o dicionario completo, varios desses sinais apresentam descricoes diferentes e por vezes contraditorias. '
    'Esta inconsistencia e particularmente problematica porque o usuario que consulta a homepage recebe uma informacao e, ao aprofundar o estudo '
    'no dicionario, encontra outra diferente. Em se tratando de lingua de sinais, onde a configuracao exata da mao e essencial para a comunicacao, '
    'essas divergencias podem causar confusao significativa e ensino incorreto.'
))

story.append(P('<b>3.1 Sinal "Oi" - Configuracao B vs Configuracao 5</b>', h2_style))

story.append(P(
    'Na homepage, o sinal "Oi" e descrito como: "Mao aberta (configuracao B) levantada ao lado da cabeca, levemente inclinada para frente - saudacao padrao em Libras." '
    'Porem, no dicionario, o mesmo sinal e descrito com configuracao 5: "Abra a mao com todos os cinco dedos estendidos e afastados (configuracao 5), '
    'Palma voltada para a pessoa com quem voce fala, na altura do rosto, Balance a mao suavemente para a direita e para a esquerda duas vezes." '
    'A diferenca entre configuracao B (dedos juntos) e configuracao 5 (dedos afastados) e fundamental na Libras. O sinal correto de "Oi" em Libras '
    'utiliza a configuracao 5, com os dedos afastados. A homepage esta ensinando erroneamente a configuracao B.'
))

story.append(P('Homepage (INCORRETO):', error_style))
story.append(P('Configuracao B - Mao aberta com dedos juntos, ao lado da cabeca', body_indent_style))
story.append(P('Dicionario (CORRETO):', correct_style))
story.append(P('Configuracao 5 - Mao aberta com dedos afastados, na altura do rosto, balanco lateral', body_indent_style))

story.append(P('<b>3.2 Sinal "Obrigado" - Testa vs Queixo</b>', h2_style))

story.append(P(
    'Na homepage, o sinal "Obrigado" e descrito como: "Mao aberta plana (B) toca o queixo com os dedos e move-se para frente." '
    'No dicionario, a descricao diz: "Toque levemente as pontas dos dedos na testa (ou queixo, conforme variante regional)." '
    'Embora existam variacoes regionais na Libras, o sinal padrao e mais reconhecido de "Obrigado" e aquele em que a mao toca o queixo e se move para frente. '
    'A mencao da testa como primeira opcao no dicionario pode confundir o aprendiz, que pode interpretar a testa como a localizacao principal. '
    'O ideal seria apresentar o queixo como localizacao primaria e a testa como variante regional secundaria, claramente diferenciada.'
))

story.append(P('<b>3.3 Sinal "Eu te amo" vs "Amor" - Descricoes Divergentes</b>', h2_style))

story.append(P(
    'Na homepage, o sinal aparece como "Eu te amo" com configuracao ILY (polegar, indicador e minimo estendidos), braco erguido. '
    'No dicionario, o sinal "Amor" (categoria Emocoes) e descrito como: "Ambas as maos fechadas em punho (configuracao S), '
    'Cruze os bracos no peito formando um X, com cada mao sobre o ombro oposto, Aperte levemente o peito uma vez, como se abracasse a si mesmo." '
    'Estes sao sinais completamente diferentes na Libras: "Eu te amo" (ILY) e um gesto emprestado da ASL, enquanto "Amor" em Libras brasileira '
    'e o sinal de bracos cruzados no peito. A homepage apresenta apenas a versao ILY, que nao e o sinal nativo de Libras para "Amor", '
    'criando confusao conceitual sobre qual sinal utilizar em contexto brasileiro.'
))

story.append(P('<b>3.4 Sinal "Aprender" - Descricao Incompleta na Homepage</b>', h2_style))

story.append(P(
    'A homepage descreve "Aprender" como: "Mao em O toca a testa e abre-se em B." Embora esta seja uma descricao simplificada, '
    'ela omite elementos importantes presentes no dicionario, como o uso da mao de apoio aberta (configuracao 5) e o movimento '
    'de fechar os dedos puxando para cima ate a testa. A descricao simplificada da homepage pode levar o usuario a fazer o sinal '
    'de forma incorreta, omitindo o ponto de partida (mao de apoio) e a trajetoria completa do movimento.'
))

story.append(PageBreak())

# ══════════════════════════════════════════════════════
# SECTION 4: Erros no handConfig do Alfabeto 3D
# ══════════════════════════════════════════════════════
story.append(P('<b>4. Erros no handConfig do Alfabeto 3D (Datilologia)</b>', h1_style))

story.append(P(
    'A datilologia do LibrasVoxPro utiliza um sistema de renderizacao 3D baseado em Canvas HTML5 para exibir a posicao correta da mao para cada letra do alfabeto manual. '
    'Cada letra possui um objeto handConfig que define a posicao de cada dedo (polegar/thumb, indicador/index, medio/middle, anelar/ring, minimo/pinky), '
    'alem de um valor de abertura (spread) e direcao do polegar (thumbSide). Os valores variam de 0 (dedo completamente fechado) a 1 (dedo completamente estendido). '
    'Quando esses valores estao incorretos, a renderizacao 3D mostra uma posicao de mao que nao corresponde a letra real da Libras, '
    'ensinando o usuario de forma equivocada. A analise identificou 4 letras com valores handConfig que produzem representacoes imprecisas.'
))

story.append(P('<b>4.1 Letra A - Polegar Muito Aberto</b>', h2_style))

story.append(P(
    'O handConfig atual da letra A define thumb=0.65, o que posiciona o polegar parcialmente levantado, distante da posicao correta. '
    'Na Libras, a letra A e formada com o punho fechado e o polegar repousando ao lado do indicador (nao sobre ele). '
    'O valor de 0.65 faz o polegar parecer quase estendido, o que se assemelha mais a configuracao da letra L ou a posicao do numero 10. '
    'O valor correto deveria estar entre 0.25 e 0.40, representando o polegar levemente afastado do punho, mas claramente nao estendido. '
    'Esta e uma diferenca visual significativa que pode confundir o aprendiz, fazendo-o acreditar que o A em Libras tem o polegar levantado.'
))

hc_a_data = [
    [Paragraph('<b>Parametro</b>', header_cell_style), Paragraph('<b>Valor Atual</b>', header_cell_style),
     Paragraph('<b>Valor Correto</b>', header_cell_style), Paragraph('<b>Observacao</b>', header_cell_style)],
    [Paragraph('thumb', cell_center_style), Paragraph('0.65', cell_center_style),
     Paragraph('0.25-0.40', cell_center_style), Paragraph('Polegar deve repousar ao lado, nao levantado', cell_style)],
    [Paragraph('index', cell_center_style), Paragraph('0', cell_center_style),
     Paragraph('0', cell_center_style), Paragraph('Correto - punho fechado', cell_style)],
    [Paragraph('spread', cell_center_style), Paragraph('0', cell_center_style),
     Paragraph('0', cell_center_style), Paragraph('Correto', cell_style)],
]
story.extend(make_table(hc_a_data, [available_width*0.15, available_width*0.15, available_width*0.15, available_width*0.55],
    'Tabela 4: Correcao do handConfig da letra A'))

story.append(P('<b>4.2 Letra G - Indicador Parcialmente Estendido</b>', h2_style))

story.append(P(
    'A letra G em Libras e formada com o indicador e o polegar estendidos e apontando para o lado (orientacao lateral), '
    'enquanto os demais dedos estao fechados. O handConfig atual define index=0.7, o que representa o indicador parcialmente dobrado. '
    'O valor correto deveria ser proximo de 1.0 (indicador totalmente estendido), para que a ponta do dedo aponte claramente para a lateral. '
    'Com o valor atual de 0.7, a mao renderizada parece uma configuracao intermediaria entre G e algo indefinido, '
    'nao representando claramente a letra G da Libras. O polegar (thumb=1.0) esta correto, totalmente estendido na mesma direcao do indicador.'
))

hc_g_data = [
    [Paragraph('<b>Parametro</b>', header_cell_style), Paragraph('<b>Valor Atual</b>', header_cell_style),
     Paragraph('<b>Valor Correto</b>', header_cell_style), Paragraph('<b>Observacao</b>', header_cell_style)],
    [Paragraph('index', cell_center_style), Paragraph('0.7', cell_center_style),
     Paragraph('0.9-1.0', cell_center_style), Paragraph('Indicador deve estar totalmente estendido', cell_style)],
    [Paragraph('thumb', cell_center_style), Paragraph('1.0', cell_center_style),
     Paragraph('1.0', cell_center_style), Paragraph('Correto', cell_style)],
    [Paragraph('thumbSide', cell_center_style), Paragraph('true', cell_center_style),
     Paragraph('true', cell_center_style), Paragraph('Correto - orientacao lateral', cell_style)],
]
story.extend(make_table(hc_g_data, [available_width*0.15, available_width*0.15, available_width*0.15, available_width*0.55],
    'Tabela 5: Correcao do handConfig da letra G'))

story.append(P('<b>4.3 Letra H - Indicador e Medio Parcialmente Estendidos</b>', h2_style))

story.append(P(
    'A letra H em Libras e semelhante ao G, mas com dois dedos (indicador e medio) estendidos juntos e apontando para o lado. '
    'O handConfig atual define index=0.8 e middle=0.8, representando ambos os dedos parcialmente dobrados. '
    'Os valores corretos deveriam ser proximos de 1.0 (ambos totalmente estendidos), para que os dois dedos apontem claramente para a lateral. '
    'Com os valores atuais, a mao parece ter os dedos curvados, o que nao corresponde a nenhuma configuracao valida da Libras. '
    'Esta e uma correcao simples porem essencial, pois a distincao entre G (um dedo) e H (dois dedos) depende de os dedos estarem claramente estendidos.'
))

hc_h_data = [
    [Paragraph('<b>Parametro</b>', header_cell_style), Paragraph('<b>Valor Atual</b>', header_cell_style),
     Paragraph('<b>Valor Correto</b>', header_cell_style), Paragraph('<b>Observacao</b>', header_cell_style)],
    [Paragraph('index', cell_center_style), Paragraph('0.8', cell_center_style),
     Paragraph('0.9-1.0', cell_center_style), Paragraph('Indicador totalmente estendido', cell_style)],
    [Paragraph('middle', cell_center_style), Paragraph('0.8', cell_center_style),
     Paragraph('0.9-1.0', cell_center_style), Paragraph('Medio totalmente estendido', cell_style)],
    [Paragraph('thumb', cell_center_style), Paragraph('0.15', cell_center_style),
     Paragraph('0.15', cell_center_style), Paragraph('Correto - polegar dobrado', cell_style)],
]
story.extend(make_table(hc_h_data, [available_width*0.15, available_width*0.15, available_width*0.15, available_width*0.55],
    'Tabela 6: Correcao do handConfig da letra H'))

story.append(P('<b>4.4 Letra S - Diferenca Sutil Demais em Relacao a Letra A</b>', h2_style))

story.append(P(
    'As letras A e S em Libras sao visualmente semelhantes - ambas sao punhos fechados - mas diferem na posicao do polegar: '
    'na letra A, o polegar repousa ao lado do indicador; na letra S, o polegar fica sobre os dedos fechados. '
    'No handConfig atual, A tem thumb=0.65 e S tem thumb=0.45. Esta diferenca de apenas 0.20 e insuficiente para distinguir claramente as duas letras na renderizacao 3D. '
    'O valor de S deveria ser ajustado para 0.55-0.65 (polegar claramente sobre os dedos), enquanto A deveria ser reduzido para 0.25-0.40 (conforme discutido na secao 4.1). '
    'Com ambas as correcoes, a diferenca visual entre A e S ficaria muito mais clara e didatica.'
))

hc_s_data = [
    [Paragraph('<b>Letra</b>', header_cell_style), Paragraph('<b>Parametro</b>', header_cell_style),
     Paragraph('<b>Valor Atual</b>', header_cell_style), Paragraph('<b>Valor Correto</b>', header_cell_style)],
    [Paragraph('A', cell_center_style), Paragraph('thumb', cell_center_style),
     Paragraph('0.65', cell_center_style), Paragraph('0.25-0.40', cell_center_style)],
    [Paragraph('S', cell_center_style), Paragraph('thumb', cell_center_style),
     Paragraph('0.45', cell_center_style), Paragraph('0.55-0.65', cell_center_style)],
]
story.extend(make_table(hc_s_data, [available_width*0.15, available_width*0.15, available_width*0.15, available_width*0.15],
    'Tabela 7: Comparacao dos valores thumb entre A e S'))

story.append(PageBreak())

# ══════════════════════════════════════════════════════
# SECTION 5: Erros nas Descricoes dos Sinais
# ══════════════════════════════════════════════════════
story.append(P('<b>5. Erros nas Descricoes dos Sinais do Dicionario</b>', h1_style))

story.append(P(
    'Alem das inconsistencias entre homepage e dicionario, a analise identificou erros nas proprias descricoes passo a passo dos sinais no dicionario. '
    'Esses erros envolvem a atribuicao incorreta de configuracoes de mao a determinados sinais, o que pode levar o usuario a reproduzir o sinal de forma errada. '
    'Em Libras, a configuracao de mao e um parametro fonologico essencial: uma mudanca na configuracao pode alterar completamente o significado do sinal. '
    'Por isso, e fundamental que as descricoes sejam precisas e correspondam a forma padrao utilizada pela comunidade surda brasileira.'
))

story.append(P('<b>5.1 Sinal "Vermelho" - Configuracao X Incorreta</b>', h2_style))

story.append(P(
    'O dicionario descreve o sinal "Vermelho" com: "Indicador estendido e levemente curvado (configuracao X relaxada), '
    'Posicione a ponta do indicador sobre o labio inferior, Passe o dedo pelo labio inferior da esquerda para a direita." '
    'A denominacao "configuracao X relaxada" esta incorreta. Na Libras, a configuracao X corresponde ao indicador curvado em gancho '
    '(como na letra X do alfabeto manual), que nao e a configuracao usada no sinal de Vermelho. O correto seria indicar a configuracao D '
    '(indicador estendido, demais dedos fechados com polegar tocando os dedos medios), que e a configuracao real utilizada neste sinal. '
    'A confusao entre X e D pode levar o aprendiz a curvar o indicador em gancho ao inves de mante-lo estendido.'
))

story.append(P('<b>5.2 Numero 9 - Configuracao F/9 Confusa</b>', h2_style))

story.append(P(
    'O dicionario descreve o numero 9 como: "Curve o indicador em gancho e toque sua ponta com a ponta do polegar (configuracao F/9)." '
    'A notacao "F/9" e ambigua e tecnicamente incorreta. Na Libras, a configuracao F e formada pelo polegar e indicador fazendo um circulo '
    '(como a letra F), enquanto o numero 9 tem o polegar tocando a ponta do indicador curvado em gancho - uma configuracao diferente. '
    'Embora ambas envolvam o contato entre polegar e indicador, a forma do contato e distinta: no F, as pontas se tocam formando um circulo; '
    'no 9, o polegar envolve a ponta do indicador curvado. A notacao "F/9" sugere que sao a mesma configuracao, o que nao e verdade. '
    'O correto seria descrever a configuracao especifica do 9 sem referencia a F.'
))

story.append(P('<b>5.3 Numero 10 - Configuracao L/10 Incorreta</b>', h2_style))

story.append(P(
    'O dicionario descreve o numero 10 como: "Mao em A (punho fechado) com polegar estendido para o lado (configuracao L/10), '
    'Sacuda o pulso de um lado para o outro duas vezes." A notacao "L/10" esta incorreta. A configuracao L em Libras tem o indicador '
    'e o polegar estendidos formando um angulo de 90 graus. O numero 10, por sua vez, tem apenas o polegar estendido para cima '
    '(com o punho fechado), enquanto o indicador permanece fechado. Sao configuracoes visualmente distintas: '
    'o L tem dois dedos visiveis (polegar e indicador), o 10 tem apenas um (polegar). Associar as duas configurações pode levar o aprendiz '
    'a fazer o sinal de 10 com o indicador tambem estendido, o que seria incorreto.'
))

story.append(P('<b>5.4 Sinal "Sim" - Configuracao A vs S</b>', h2_style))

story.append(P(
    'O dicionario descreve o sinal "Sim" com: "Mao fechada (A ou S) com movimento de cima para baixo imitando um aceno de cabeca afirmativo." '
    'Embora a descricao mencione ambas as configuracoes, a ambiguidade e problematica. Na Libras, o sinal "Sim" e tipicamente produzido '
    'com a configuracao S (punho fechado com polegar sobre os dedos), e a referencia a configuracao A (polegar ao lado) pode confundir. '
    'A distincao entre A e S, embora sutil, e fonologicamente relevante na Libras. O ideal seria indicar claramente a configuracao S '
    'como a padrao para este sinal, sem apresentar A como alternativa equivalente.'
))

story.append(P('<b>5.5 Sinal "Ingles" - Localizacao Testa vs Queixo</b>', h2_style))

story.append(P(
    'O dicionario descreve o sinal "Ingles" como: "Mao em I (apenas o dedo minimo estendido, demais fechados), '
    'Toque levemente a testa com o minimo estendido e mova a mao para o lado em arco." A localizacao na testa pode estar incorreta. '
    'Em muitas variantes da Libras, o sinal de "Ingles" e produzido com o minimo tocando o queixo (ou a regiao próxima a ele), '
    'e nao a testa. A testa como ponto de articulacao e mais associada a sinais de genero masculino (como Pai) e a sinais cognitivos '
    '(como Pensar/Aprender). A regiao do queixo e mais associada a sinais de linguagem e comunicacao. '
    'E necessario verificar com falantes nativos de Libras qual a localizacao padrao para este sinal.'
))

story.append(P('<b>5.6 Resumo das Correcoes Necessarias nas Descricoes</b>', h2_style))

desc_errors_data = [
    [Paragraph('<b>Sinal</b>', header_cell_style), Paragraph('<b>Erro</b>', header_cell_style),
     Paragraph('<b>Correcao</b>', header_cell_style)],
    [Paragraph('Vermelho', cell_style), Paragraph('Config. X relaxada', cell_style),
     Paragraph('Config. D (indicador estendido)', cell_style)],
    [Paragraph('Numero 9', cell_style), Paragraph('Config. F/9 ambigua', cell_style),
     Paragraph('Descrever config. especifica do 9 sem ref. a F', cell_style)],
    [Paragraph('Numero 10', cell_style), Paragraph('Config. L/10 incorreta', cell_style),
     Paragraph('Config. com apenas polegar estendido (nao L)', cell_style)],
    [Paragraph('Sim', cell_style), Paragraph('Config. A ou S ambigua', cell_style),
     Paragraph('Config. S como padrao (polegar sobre dedos)', cell_style)],
    [Paragraph('Ingles', cell_style), Paragraph('Localizacao: testa', cell_style),
     Paragraph('Verificar: possivel localizacao no queixo', cell_style)],
    [Paragraph('Oi (homepage)', cell_style), Paragraph('Config. B na homepage', cell_style),
     Paragraph('Corrigir para Config. 5 (dedos afastados)', cell_style)],
    [Paragraph('Obrigado (dic.)', cell_style), Paragraph('Testa como primeira opcao', cell_style),
     Paragraph('Queixo como padrao, testa como variante', cell_style)],
]
story.extend(make_table(desc_errors_data, [available_width*0.18, available_width*0.35, available_width*0.47],
    'Tabela 8: Resumo das correcoes necessarias nas descricoes dos sinais'))

story.append(PageBreak())

# ══════════════════════════════════════════════════════
# SECTION 6: Problema das Imagens Geradas por IA
# ══════════════════════════════════════════════════════
story.append(P('<b>6. Problema das Imagens Geradas por IA</b>', h1_style))

story.append(P(
    'Todas as imagens dos sinais no LibrasVoxPro sao geradas pela API do Readdy.ai, um servico de geracao de imagens por inteligencia artificial. '
    'A analise do codigo-fonte revelou que as URLs das imagens seguem o padrao: '
    '"https://readdy.ai/api/search-image?query=Close up photograph of a real human hand performing the Brazilian sign language Libras gesture..." '
    'com parametros de busca descritivos em ingles. Embora esta abordagem permita gerar imagens rapidamente sem necessidade de fotografias reais, '
    'ela apresenta um problema fundamental: modelos de geracao de imagem por IA frequentemente nao conseguem reproduzir com precisao as configuracoes '
    'especificas de mao da Libras. Configuracoes como ILY (polegar, indicador e minimo estendidos), a diferenca entre B (dedos juntos) e 5 (dedos afastados), '
    'ou a posicao exata dos dedos em configuracoes como F, G, H, R, X e outras sao extremamente dificeis para IA gerar corretamente.'
))

story.append(P(
    'O resultado pratico e que muitas das imagens exibidas no dicionario podem mostrar maos em posicoes que nao correspondem exatamente ao sinal de Libras. '
    'Para um aprendiz que esta usando a imagem como referencia visual primaria, isso pode levar a reproducao incorreta do sinal. '
    'O ideal para um projeto educacional de Libras seria utilizar fotografias reais de maos de pessoas fluentes em Libras, ou pelo menos validar '
    'cada imagem gerada por IA com um consultor surdo ou interpreter de Libras antes de publica-la. '
    'Uma alternativa intermediaria seria usar o renderizador 3D do Canvas (que ja existe para a datilologia) para gerar ilustracoes tecnicas precisas dos sinais, '
    'complementando ou substituindo as fotografias geradas por IA.'
))

story.append(P('<b>6.1 Analise das URLs de Imagem</b>', h2_style))

story.append(P(
    'As URLs de imagem contem prompts detalhados em ingles, como: "Close up photograph of a real human hand performing the Brazilian sign language '
    'Libras greeting gesture for hello with an open flat palm facing forward positioned near the head on a clean neutral light gray background '
    'with soft professional studio lighting creating realistic skin texture and natural shadows." Estes prompts sao bem construidos e especificos, '
    'mas a precisao da geracao depende inteiramente da capacidade do modelo de IA subjacente. '
    'A analise das imagens efetivamente carregadas no site mostrou que, em varios casos, a posicao dos dedos na imagem gerada nao corresponde '
    'exatamente a descricao no prompt ou a configuracao descrita no dicionario. Este e um limitacao inerente da geracao de imagens por IA '
    'que nao pode ser resolvida apenas com prompts melhores - e necessario um processo de curadoria humana.'
))

# ══════════════════════════════════════════════════════
# SECTION 7: Recomendacoes
# ══════════════════════════════════════════════════════
story.append(P('<b>7. Recomendacoes para Correcao</b>', h1_style))

story.append(P('<b>7.1 Correcoes Prioritarias (Severidade Alta)</b>', h2_style))

story.append(P(
    'As correcoes de alta prioridade devem ser implementadas imediatamente, pois afetam diretamente o ensino correto da Libras. '
    'A primeira acao recomendada e unificar as descricoes dos sinais entre a homepage e o dicionario, garantindo que ambas as paginas '
    'apresentem a mesma configuracao de mao. A homepage deve ser atualizada para refletir as descricoes completas e corretas do dicionario. '
    'Em segundo lugar, os valores de handConfig das letras A, G, H e S devem ser corrigidos conforme detalhado na secao 4 deste relatorio. '
    'Por fim, as descricoes dos sinais Vermelho, Numero 9, Numero 10 e Sim devem ter suas configuracoes de mao corrigidas, '
    'removendo ambiguidades e referencias a configuracoes incorretas.'
))

rec_priority_data = [
    [Paragraph('<b>Acao</b>', header_cell_style), Paragraph('<b>Detalhe</b>', header_cell_style),
     Paragraph('<b>Arquivo/Local</b>', header_cell_style)],
    [Paragraph('Corrigir homepage "Oi"', cell_style),
     Paragraph('Alterar config B para config 5', cell_style),
     Paragraph('Componente da homepage (JS bundle)', cell_style)],
    [Paragraph('Corrigir handConfig A', cell_style),
     Paragraph('thumb: 0.65 para 0.30', cell_style),
     Paragraph('Array de letras (datilologia)', cell_style)],
    [Paragraph('Corrigir handConfig G', cell_style),
     Paragraph('index: 0.7 para 1.0', cell_style),
     Paragraph('Array de letras (datilologia)', cell_style)],
    [Paragraph('Corrigir handConfig H', cell_style),
     Paragraph('index/middle: 0.8 para 1.0', cell_style),
     Paragraph('Array de letras (datilologia)', cell_style)],
    [Paragraph('Corrigir handConfig S', cell_style),
     Paragraph('thumb: 0.45 para 0.60', cell_style),
     Paragraph('Array de letras (datilologia)', cell_style)],
    [Paragraph('Corrigir descricao "Vermelho"', cell_style),
     Paragraph('Remover "config X", usar "config D"', cell_style),
     Paragraph('Array de sinais (dicionario)', cell_style)],
    [Paragraph('Corrigir descricao "9"', cell_style),
     Paragraph('Remover "F/9", descrever config propria', cell_style),
     Paragraph('Array de sinais (dicionario)', cell_style)],
    [Paragraph('Corrigir descricao "10"', cell_style),
     Paragraph('Remover "L/10", descrever config propria', cell_style),
     Paragraph('Array de sinais (dicionario)', cell_style)],
]
story.extend(make_table(rec_priority_data, [available_width*0.25, available_width*0.40, available_width*0.35],
    'Tabela 9: Plano de correcoes prioritarias'))

story.append(P('<b>7.2 Correcoes Secundarias (Severidade Media)</b>', h2_style))

story.append(P(
    'As correcoes secundarias envolvem melhorias que aumentam a qualidade e confiabilidade do conteudo, mas que nao causam erros criticos de ensino. '
    'A primeira recomendacao e revisar a descricao de "Obrigado" para apresentar o queixo como localizacao primaria e a testa como variante regional, '
    'claramente diferenciada. A segunda e verificar com falantes nativos de Libras a localizacao correta do sinal "Ingles" (testa vs queixo). '
    'A terceira e esclarecer a distincao entre os sinais "Eu te amo" (ILY) e "Amor" (bracos cruzados) na homepage, '
    'para evitar que o usuario confunda um gesto emprestado da ASL com o sinal nativo de Libras. '
    'Adicionalmente, recomenda-se uma revisao completa de todos os 210 sinais por um consultor surdo ou interprete certificado de Libras, '
    'para garantir que nao existam outros erros que nao foram identificados nesta analise automatizada.'
))

story.append(P('<b>7.3 Melhoria Estrutural (Longo Prazo)</b>', h2_style))

story.append(P(
    'Para garantir a qualidade a longo prazo, recomenda-se substituir progressivamente as imagens geradas por IA por fotografias reais de maos '
    'de pessoas fluentes em Libras, ou pelo menos validar cada imagem gerada por IA com um consultor surdo. '
    'Outra melhoria estrutural seria expandir o renderizador 3D do Canvas (atualmente usado apenas para a datilologia) '
    'para tambem ilustrar os sinais do dicionario, criando representacoes tecnicas e precisas das configuracoes de mao. '
    'Finalmente, recomenda-se adicionar videos reais de demonstracao para todos os sinais (atualmente, muitos sinais nao possuem videoUrl preenchido), '
    'ja que a lingua de sinais e essencialmente tridimensional e dinamica, e nao pode ser totalmente capturada por imagens estaticas ou descricoes textuais.'
))

# ━━ Build Document ━━
doc.build(story)
print(f'PDF gerado com sucesso: {OUTPUT_PDF}')
print(f'Tamanho: {os.path.getsize(OUTPUT_PDF)} bytes')

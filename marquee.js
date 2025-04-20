const TEXTS = [
    "Brudroro, um nome rico gerado por inteligência artificial!",
    "Piseiro do Xundas v1.0 já está no ar!",
    "Ser gay? - Xundas questionou... Ele só quer ser feliz!",
    "Recordes, apenas recordes importam - Xundas.",
    "Xundas tentou ajudar o lixeiro, mas 'sem querer' masturbou a alavanca.",
    "Uma vez polenta, sempre polenta - Diz estudos.",
    "Dei, mas não sou de dar - Xundas.",
    "Ele só queria um ronaldo pra ele! Entrevista com Xundas hoje as 16:20.",
    "Ain pai paaara - Xundas disse ao ver um grosso.",
    "Será que Xundas é capaz de zerar este jogo?",
    "Agora vou poder medir meu pau! - Xundas disse ao descobrir que cientistas criaram régua atômica.",
    "Oh Bicho! Psh Psh! - Disse Xundas na FURB.",
    "Xundas explica o porque dele preferir o nome: Botelho Pinto no Buraco.",
    "Dá 2 pontos no boletim psor! - Ele disse muito iludido.",
    "Shibainu sobe 830% em 1 dia!",
    "Isso é mesmo pão de batata? - Perguntou Xundas pensando que era um bolachão.",
    "ELA NÃO TOMA ESSA MARCA DE TEQUILA! - Xundas apenas gritou!",
    "Xundas explica o perigoso efeito 'caganeira' e cientistas ficam chocados!",
    "Cuidado com a fase 24! CUIDADO!",
    "Mulher de cantina explica como é feito o pão de batata para Xundas. Ele só conseguiu pestar atenção nos olhos arregalados!",
    "Será que tem um grampo preso na minha camisa? - Perguntou Xundas.",
    "Toma este Kfir! - Disse o médico para Xundas. Apenas isto.",
    "Xundas compra um template CSS admin. Jogou dinheiro fora!",
    "Deixa chover! - Disse xundas quando viu que a chuva estava branca!",
    "Cheiro de peixe! - Xundas descreve como é ter levado mexicanas para o quarto!",
    "Muitos acreditam que 'ter caganeira' é apenas uma forma de evitar de dar o cu!",
    "Pisei num catarro! - Xundas descreve como é morar numa casa com velhos no Canadá!",
    "Eu me auto-como todas as noites! - Xundas explica como é ter um pau com vida própria!",
    "Xundas admite ter assistido 'Pai de Família' 12 vezes!",
    "'Faltava algo então achei que era uma mulher!' - Disse banhista ao ver Xundas na praia do Pinho!",
    "Xundas explica como foi ter quase se cagado no carro, ao lado da sogra!",
    "Eu to XONADO Vinasso! - Diz Xundas quando descobriu que a mina vai voltar!",
    "Estudos mostram que pessoas chamadas de 'Bruno' tem mais chances de gostarem de cheiro de saco!",
    "Eu sou leigo! Eu tenho limitações! Não dá!",
    "Google revela pesquisa mais feita por Xundas: 'Homens de Sunga'",
    "Ain vinasso, paaaraaa! - Disse Xundas ao imitar Nando!",
    "Cai no dildo com 6 anos. - Explica Xundas sobre o motivo de brincar tanto com cú.",
    "Eu fui enganado! - Xundas descreve como foi ter andado tanto por um jogo, e não ter recebido o jogo!",
]

$(() => {
    let text = "";
    TEXTS.forEach(x => {
        text += x + generateSpaces(100);
    });
    $("#marquee").html(text);
});

function generateSpaces(n) {
    let spaces = "";
    for (let i = 0; i < n; i++) {
        spaces += "&nbsp;";
    }
    return spaces;
}
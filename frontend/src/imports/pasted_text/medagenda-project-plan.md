O texto abaixo descreve o sistema que preciso que seja criado, será apresentado em um trabalho de faculdade, siga as diretrizes apresentadas:
---------------
Introdução:
O projeto MedAgenda foi idealizado pelos seguintes integrantes: Arthur, Bruno Gonçalves, Carlos dos Reis Junior, Enrico Tulio e tem como objetivo auxiliar as pessoas idosas e suas famílias na marcação de consultas e acompanhamento médico por meio de um sistema intuitivo que possibilita a criação de grupos adição de informações em determinadas datas de um calendário. O grupo espera por meio deste trabalho, fornecer para a sociedade uma ferramenta que ajude sobretudo as famílias que possuem pessoas idosas que necessitam de suporte em relação às datas de consultas, retornos médicos e etc.

Objetivo Geral:
Auxiliar as pessoas idosas e suas famílias quanto a ogranização, marcação e acompanhamento de consultas médicas por meio de um software intuitivo de interface baseada em calendário para então permitir a adição de informações nas datas do calendário.

Objetivos Específicos:
-Implementar o software baseando-se em uma interface de calendário para facilitar a visualização dos compromissos;
-Permitir também o uso do software pelos familiares e responsáveis para que estes possam gerenciar as consultas de seus dependentes;
-Ser intuitivo e promover uma fácil usabilidade, permitindo adicionar todas as informações pertinentes às consultas por meio de um formulário;
-Garantir a acessibilidade por meio de ferramentas de ampliação para que seja mais fácil a visualização das informações apresentadas pelo software;
-Assegurar a conformidade com relação a padrões de segurança de dados e a LGPD por meio de validações de CPF (PIN) e regras de acesso simplificadas.

Plano de Qualidade:
1-Atributos de qualidade relevantes
Atributo -- Justificativa

-Adequação Funcional - Esperamos que nosso software atenda as necessidades pelas quais ele foi planejado a solucionar (visualizar, agendar e marcar);
=Capacidade de interação (com foco nos sub-atributos: inclusão, facilidade de aprendizado e operabilidade) - O sistema contará com diversas ferramentas que visam tornar o seu uso mais simplificado e dinâmico para atender qualquer pessoa independente de sua capacidade técnica;
-Confiabilidade - É esperado do nosso sistema que, a partir do momento que uma consulta foi marcada ela permanecerá marcada para o usuário;
-Segurança - Diante o atual contexto da sensibilidade de dados, sobretudo, dados sensíveis como os médicos que serão tratatos pelo nosso sistema, faz-se necessário respeitar os padrões indicados pela LGPD, para se garantir o acesso seguro da conta de cada usuário.

2-Metas quantitativas
Atributo -- Descrição/Quantificação

-Taxa de Sucesso - Esperamos que por meio da nossa plataforma intuitiva e de simples manuseio pelo menos 70% dos usuários, mesmo os dependentes sejam capazes de agendar suas consultas sem a ajuda de um terceiro;
-Totalidade de informações - Como o usuário não preencherá nada, mas selecionará, é necessário que sejam apresentados todas as opções possíveis no formulário, ou seja, 100% dos casos possíveis.
-Persistência de dados - As informações cadastradas no calendário de cada usuário devem permanecer cadastradas mesmo que ele saia da aplicação, nesse contexto, 100% do que foi escrito em determinada data deve persistir escrito quando o usuário reentrar no sistema.
-Acessos não Permitidos - O sistema deverá ter uma taxa de 0% de acessos permitidos com PIN incorreto.

3-Metodologias para validação dos índices obtidos Conforme pesquisado e apontado pelo código ISO 25010, usaremos algumas métricas que apesar de simples, apontarão o quão bem nosso sistema entrega aquilo que foi planejado a ser fornecido por ele. Usaremos as seguintes metodologias: A| Inspeção - Através da revisão de grupo, esperamos simular a famosa revisão por pares na qual um membro da equipe revisará inicialmente a documentação realizada, para se garantir que não existem erros lógicos e garantir uniformidade entre o que foi discutido e planejado e o que está sendo escrito e futuramente codificado. B| Testes "CAIXA PRETA" - Desejamos realizar testes puramente sobre o código para garantir que as regras de negócio e restrições que pensamos estejam sendo bem aplicadas. Um exemplo disso seria testar a aceitação da função de autenticação ao se colocar 5 digitos ao invés de 4 que eram esperados. C| Testes de Usabilidade - Espera-se do sistema uma interface intuitiva e de fácil aprendizado por tratar-se de um público alvo de pessoas idosas e de dificuldade técnica quanto a tecnologias.

4-Ferramentas de mediação Para se averiguar quantificadamente as metas e métricas citadas anteriormente, usaremos das seguintes ferramentas: A| Google Lighthouse - Fornecida gratuitamente pelo Chrome medirá a acessibilidade e desempenho de nosso sistema em parâmetros que vão de 0 a 100. B| Extensão "WAVE" - Também é fornecida pelo navegador, mas no formato de uma extensão e aponta erros de contraste e tamanho de fonte. C| GitHub Issues - Ferramenta própria do Github que pode ser usada para registrar os bugs encontrados.

5-Métodos mais utilizados em um contexto profissional Apesar de recomendados, os métodos que serão citados a seguir são de maior complexidade e custo para se realizar e portanto, impossibilita sua aplicação em nosso atual projeto, mas ainda podemos aplicá-los teoricamente confira: A| Testes de Carga - Estes são comumentemente usados para medir a confiabilidade de um determinado sistema e em nosso caso, simularia o acesso simultâneo de 1.000 usuários por exemplo e então, se avaliaria se houve perda de desempenho por parte do software. B| Eye Tracking - Apesar de recente, este é muito utilizado pois faz uso de câmeras que rastream o movimento dos olhos e, em nosso caso, simularíamos se o posicionamento e dimensão dos botões e apresentação das informações é compatível com as expectativas do usuário idoso.

Regras de Negócio:
RdN01 – Hierarquia de Gestão Familiar: A gestão das informações de saúde deve ser dividida entre um perfil "Responsável" (quem gerencia) e perfis "Dependentes" (idosos que recebem o suporte), garantindo que o cuidador tenha controle sobre as agendas dos assistidos;
RdN02 – Formato da Senha: Para facilitar o acesso do público alvo e garantir a segurança de seus dados, as senhas devem ter exatamente 6 caracteres alfanuméricos;
RdN03 – Autenticação de Segurança: O acesso aos dados sensíveis de saúde e ao calendário de consultas exige a validação de uma credencial de segurança (PIN), visando proteger a privacidade das informações médicas da família. O PIN é formado unica e obrigatoriemente por 4 números.
RdN04 – Composição Mínima de Agendamento: Para que uma consulta seja considerada válida no planejamento, o registro deve obrigatoriamente identificar o paciente (dependente), o local do atendimento, a especialidade médica e o horário previsto;
RdN05 – Premissa de Acessibilidade Visual: Toda informação apresentada deve seguir padrões de alta legibilidade e possuir ferramentas de ampliação, garantindo que o público idoso consiga realizar o acompanhamento de suas próprias datas com autonomia;
RdN06 – Unicidade de Identificação: O cadastro do usuário responsável pela conta é vinculado obrigatoriamente a um CPF único, assegurando a integridade dos dados e a responsabilidade legal pelas informações inseridas no sistema;
RdN07 – Disponibilidade de Histórico: O calendário deve permitir a navegação entre meses passados e futuros para que a família possa consultar o histórico de retornos e planejar consultas preventivas a longo prazo;
RdN08 - Bloqueio de datas Passadas: Não será permitido o agendamento de consultas em datas anteriores à data atual.

Histórias de Usuário:
HdU01 - Como responsável familiar, eu quero cadastrar perfis de dependentes idosos, para que eu possa centralizar a gestão da saúde de diferentes parentes em uma única conta;
HdU02 - Como usuário do sistema, eu quero acessar minha conta através de um PIN de segurança, para que minhas informações médicas e de familiares fiquem protegidas;
HdU03 - Como pessoa idosa, eu quero visualizar um calendário com elementos grandes e ferramentas de ampliação, para que eu consiga identificar minhas consultas sem depender de ajuda externa;
HdU04 - Como familiar cuidador, eu quero preencher um formulário simples com local e especialidade da consulta, para que eu não esqueça detalhes importantes do atendimento médico;
HdU05 - Como usuário, eu quero visualizar os detalhes de um agendamento e ter a opção de desmarcá-lo, para que meu calendário reflita fielmente os compromissos confirmados;

Requisitos:
RF01 - Gestão de Perfis

Descrição: O sistema deve permitir que seja cadastrado além do usuário principal (responsável) também sejam cadastrados seus dependentes.
Classificação: Funcional
Referência: RdN01; HdU01
Critérios de aceite GHERKIN:
A) Cenário: Cadastrar um dependente com sucesso
Dado que já criei meu usuário principal (responsável)
Quando eu seleciono adicionar e preencho os espaços nome (apenas com letras) e um CPF (válido) para o dependente
E clico em "Salvar Perfil"
Então o perfil de "fulano" deve aparecer na lista de seleção de pacientes.
B) Cenário: Cadastrar um dependente com falha
Dado que já criei meu usuário principal (responsável)
Quando eu seleciono adicionar e não preencho algum dos espaços obrigatórios como : nome (apenas com letras) e CPF (válido) para o dependente
E clico em "Salvar Perfil"
Então o perfil de "fulano" não deve aparecer na lista de seleção de pacientes, bem como também receber um feedback do erro
RF02 - Segurança e autenticação

Descrição: O sistema deve solicitar no login além do CPF e senha da conta, também o seu PIN.
Classificação: Funcional
Referência: RdN03; HdU02
Critérios de aceite GHERKIN:
A) Cenário: Acessar conta com sucesso
Dado que já possuo conta cadastrada
Quando eu preencho os espaços apresentados no login (CPF, senha e PIN) corretamente
E clico em "Acessar"
Então o devo ser redirecionado para tela principal da aplicação
B) Cenário: Acessar conta com falha
Dado que já possuo conta cadastrada
Quando eu preencho os espaços apresentados no login (CPF, senha e PIN) incorretamente ou deixo de preencher qualquer um deles
E clico em "Acessar"
Então o devo ser impedido de aceder o sistema e receber um alerta com a mensagem de "CPF, Senha ou PIN incorretos"
RF03 - Calendário e main page

Descrição: O sistema apresentará a tela principal, a qual corresponde a interface de calendário no espaço disponível
Classificação: Funcional
Referência: RdN05; HdU03
Critérios de aceite GHERKIN:
A) Cenário: Visualizar o calendário e dias específicos sem nada marcado
Dado que já passei pela autenticação e/ou criação de conta
Quando sou redirecionado para a tela principal posso navegar pelo calendário apresentado e selecionar uma data
E ao clicar em uma determinada data
Então será aberto um formulário para cadastro de uma consulta para aquele dia
B) Cenário: Visualizar o calendário e dias específicos com algo marcado
Dado que já passei pela autenticação e/ou criação de conta
Quando sou redirecionado posso navegar pelo calendário apresentado e selecionar uma data demarcada por cor diferente
E ao clicar nesta data demarcada
Então será apresentada as informações que foram adicionadas àquela data
RF04 - Ferramenta de Zoom

Descrição: O sistema apresentará na tela principal no canto inferior direito ao do calendário o ícone de uma lupa que ao ser selecionada fornecerá uma interface com + para aumento de "zoom" e - para redução de "zoom"
Classificação: Funcional
Referência: RdN05; HdU03
Critérios de aceite GHERKIN:
A) Cenário: Selecionar o ícone da lupa
Dado que me deparei com um ícone de lupa no canto inferior direito enquanto navegava pela interface
Quando aproximo o mouse deste, ele muda visualmente
E ao clicar no ícone
Então surgirá uma pequena interface com os ícones + e - para respectivamente aumentar e reduzir o zoom aplicado na tela
B) Cenário: Desselecionar o ícone da lupa
Dado que estou com o ícone da lupa pressionado
Quando novamente me aproximo o mouse deste, ele muda visualmente
E ao clicar no ícone
Então a pequena interface com os ícones + e - desaparecerá
RF05 - Formulário de agendamento de consulta

Descrição: O software apresentará ao usuário um formulário que solicitará a seleção de paciente (responsável ou dependentes), local (limitado a cidades), especialidade médica (ortopedia, odontologia e etc) e horário de início previsto (delimitado por horas - 00:00 a 23:00)
Classificação: Funcional
Referência: RdN04, RdN08; HdU04
Critérios de aceite GHERKIN:
A) Cenário: Clicar em uma data sem marcação do sistema
Dado que estou navegando na interface de calendário e encontro a data para a qual desejo marcar minha consulta
Quando seleciono a data será apresentado um formulário solicitando a seleção de: paciente, local, especialidade e data
E ao clicar "Marcar consulta"
Então o formulário ficará oculto e será retornada uma mensagem de sucesso no cadastro de determinada consulta
B) Cenário: Clicar em uma data com marcação do sistema
Dado que finalizei o formulário, mas notei que alguma das informações estava incorreta
Quando seleciono a data serão apresentadas as informações da consulta previamente marcada
E ao clicar "Editar consulta"
Então o formulário deve permitir a edição dos campos mantendo os dados previamente inseridos.
RF06 - Visualizar e desmarcar consulta marcada

Descrição: O software demarcará com tonalidade diferente do padrão as datas para as quais já existem consultas marcadas e ao selecionar nestas, serão apresentadas as informações para a mesma, além dos seguintes botões "Editar Consulta" e "Desmarcar Consulta"
Classificação: Funcional
Referência: RdN07; HdU05
Critérios de aceite GHERKIN:
A) Cenário: Clicar em uma data com marcação do sistema
Dado que preciso desmarcar uma consulta por motivos de força maior
Quando seleciono a data serão apresentadas as informações da consulta previamente marcada
E ao clicar "Desmarcar Consulta"
Então as informações daquela data serão apagadas e a demarcação da determinada data voltará ao padrão
RNF01 - Acessibilidade

Descrição: Será pensado pelo sistema algumas normas básicas de acessibilidade como o uso da padronização (WCAG) para contraste entre o texto e o fundo.
Classificação: Não Funcional
Referência: RdN05; HdU03

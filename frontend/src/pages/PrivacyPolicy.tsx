import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer";
import { Link } from "react-router-dom";

/* Observação Importante:
TEXTO FEITO COM GEMINI!!!!
Este é um modelo genérico. As leis de privacidade (como a LGPD no Brasil) são complexas e podem exigir adaptações específicas para a forma como seu portal opera, coleta e processa dados. É fundamental que você consulte um profissional jurídico para garantir que sua Política de Privacidade esteja totalmente em conformidade com a legislação vigente e que proteja adequadamente o seu portal e os dados dos seus usuários. */

export default function PrivacyPolicy() {
    return (
        <>
        <Header />
            <main id="main" className="portal-container legal legal-copy">
                <h1 className="text-2xl font-bold mb-4">Política de Privacidade</h1>
                <p>A sua privacidade é de extrema importância para o Radar de Notícias RJ. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso portal de notícias. Ao acessar e usar o Radar de Notícias RJ, você concorda com as práticas descritas nesta política.</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">1. Informações que Coletamos</h2>
                <p>Coletamos diferentes tipos de informações para fornecer e melhorar nossos serviços:</p>

                <h3 className="font-semibold mt-4 mb-2">Informações de Navegação e Uso</h3>
                <p>Quando você acessa nosso portal, podemos coletar automaticamente informações sobre sua navegação, como seu endereço IP, tipo de navegador, sistema operacional, páginas visitadas, tempo de permanência, links clicados e sites de referência. Isso nos ajuda a entender como os usuários interagem com nosso conteúdo e a otimizar a experiência.</p>

                <h3 className="font-semibold mt-4 mb-2">Cookies e Tecnologias Semelhantes</h3>
                <p>Utilizamos cookies e outras tecnologias de rastreamento (como web beacons e pixels) para coletar informações sobre sua atividade de navegação. Cookies são pequenos arquivos de texto armazenados em seu dispositivo que nos permitem reconhecê-lo em futuras visitas, personalizar sua experiência, analisar o tráfego do site e medir a eficácia de publicações. Você pode configurar seu navegador para recusar todos os cookies ou para indicar quando um cookie está sendo enviado. No entanto, algumas funcionalidades do portal podem não funcionar corretamente sem cookies.</p>

                <h3 className="font-semibold mt-4 mb-2">Informações Fornecidas Voluntariamente (se aplicável)</h3>
                <p>Se o portal permitir comentários, cadastros para newsletters, formulários de contato ou outras interações que exijam dados, coletaremos as informações que você nos fornecer diretamente, como nome, endereço de e-mail e outras informações de contato.</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">2. Como Usamos Suas Informações</h2>
                <p>Utilizamos as informações coletadas para diversas finalidades:</p>

                <h3 className="font-semibold mt-4 mb-2">Melhorar e Personalizar a Experiência</h3>
                <p>Para entender suas preferências e hábitos de leitura, permitindo-nos adaptar o conteúdo e a apresentação do portal para torná-lo mais relevante para você.</p>

                <h3 className="font-semibold mt-4 mb-2">Análise e Estatísticas</h3>
                <p>Para monitorar e analisar tendências, uso e atividades em relação ao nosso portal, a fim de aprimorar nossos serviços e funcionalidade.</p>

                <h3 className="font-semibold mt-4 mb-2">Comunicações</h3>
                <p>Se você se inscrever em nossa newsletter, usaremos seu endereço de e-mail para enviar atualizações, notícias e informações relevantes. Você pode cancelar a inscrição a qualquer momento.</p>

                <h3 className="font-semibold mt-4 mb-2">Segurança e Manutenção</h3>
                <p>Para manter a segurança e a integridade do nosso portal, detectar e prevenir fraudes e solucionar problemas técnicos.</p>

                <h3 className="font-semibold mt-4 mb-2">Publicidade (se aplicável)</h3>
                <p>Podemos usar informações para exibir anúncios relevantes de parceiros. No entanto, não compartilharemos suas informações de identificação pessoal com anunciantes sem o seu consentimento explícito.</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">3. Compartilhamento de Informações</h2>
                <p>Não vendemos, trocamos ou alugamos suas informações pessoais de identificação para terceiros. Podemos compartilhar informações não pessoais e agregadas (que não podem identificá-lo individualmente) com parceiros, anunciantes e outras entidades para fins de análise ou marketing.</p>

                <h3 className="font-semibold mt-4 mb-2">Podemos compartilhar suas informações com:</h3>

                <h3 className="font-semibold mt-4 mb-2">Prestadores de Serviços</h3>
                <p>Terceiros que nos ajudam a operar o portal, conduzir nossos negócios ou prestar serviços a você (por exemplo, serviços de hospedagem, análise de dados). Esses terceiros têm acesso às suas informações apenas para realizar essas tarefas em nosso nome e são obrigados a não divulgá-las ou usá-las para outras finalidades.</p>

                <h3 className="font-semibold mt-4 mb-2">Requisitos Legais</h3>
                <p>Se formos obrigados por lei ou em resposta a uma solicitação judicial válida a divulgar suas informações.</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">4. Segurança das Informações</h2>
                <p>Implementamos medidas de segurança razoáveis para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, lembre-se que nenhum método de transmissão pela internet ou de armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis para proteger suas informações pessoais, não podemos garantir sua segurança absoluta.</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">5. Seus Direitos</h2>
                <p>Você pode ter certos direitos em relação às suas informações pessoais, dependendo da legislação aplicável, incluindo o direito de:</p>
                <ul className="list-disc pl-5">
                    <li>Acessar as informações pessoais que temos sobre você.</li>
                    <li>Solicitar a correção de informações imprecisas ou incompletas.</li>
                    <li>Solicitar a exclusão de suas informações pessoais.</li>
                    <li>Opor-se ao processamento de suas informações para certas finalidades.</li>
                    <li>Retirar seu consentimento a qualquer momento (se o processamento for baseado em consentimento).</li>
                    <li>Para exercer qualquer um desses direitos, entre em contato conosco através dos canais indicados abaixo.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-6 mb-2">6. Links para Sites de Terceiros</h2>
                <p>Nosso portal pode conter links para sites de terceiros. Esta Política de Privacidade se aplica apenas ao Radar de Notícias RJ. Não somos responsáveis pelas práticas de privacidade ou conteúdo de sites de terceiros. Aconselhamos que você revise as políticas de privacidade de todos os sites que visitar.</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">7. Alterações a Esta Política de Privacidade</h2>
                <p>Podemos atualizar nossa Política de Privacidade periodicamente. Publicaremos a nova política nesta página, e a data da "Última Atualização" será revisada. Recomendamos que você revise esta Política de Privacidade periodicamente para quaisquer alterações. As alterações a esta Política de Privacidade são efetivas quando são publicadas nesta página.</p>

                <h2 className="text-xl font-semibold mt-6 mb-2">8. Contato</h2>
                <p>Se você tiver dúvidas sobre esta Política de Privacidade ou sobre as práticas do Radar de Notícias RJ, <Link to="/contato" className="text-red-900 font-semibold cursor-pointer hover:text-red-600">entre em contato conosco</Link>.</p>
            </main>
        <Footer />
        </>
    );
}

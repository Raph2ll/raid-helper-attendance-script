(async () => {
    const serverName = /round table/i;
    const serverChat = "containerDefault_c69b6d"
    const serverList = "Mostrar lista de membros"

    // 1️⃣ Encontra o servidor correto na barra lateral esquerda
    const allServers = document.querySelectorAll('div[role="treeitem"][aria-label]');
    
    let serverElement = null;
    
    for (const element of allServers) {
        const label = element.getAttribute('aria-label');
        if (serverName.test(label)) {
            serverElement = element;
            break;
        }
    }
    
    if (serverElement) {
        serverElement.click();
        console.log(`✅ Servidor "${serverElement.getAttribute('aria-label')}" aberto!`);
    } else {
        console.error(`❌ Servidor com nome semelhante a ${serverName} não encontrado!`);
    }


    document.querySelector('a[href="/channels/1318374478270562368/1318738271332991056"]').click();

    // Encontra o a lista de membros
    const serverMembersList = document.querySelector(`div[role="button"][aria-label="${serverList}"]`);
        serverMembersList.click();
        console.log(`✅ Lista de membros aberta!`);
        
    // Aguarda 2 segundos para garantir que a lista carregou
    await new Promise(resolve => setTimeout(resolve, 2000));

    const seenUsers = new Set();

    const logNewUsers = () => {
        const members = document.querySelectorAll('span.name__5d473.username__703b9.desaturateUserColors__41f68');
        members.forEach(member => {
            const username = member.textContent.trim();
            if (!seenUsers.has(username)) {
                seenUsers.add(username);
                console.log(username);
            }
        });
    };
    
    const scrollDown = (query) => {
            document.querySelector(query).scrollTo({ top: 100000, behavior: 'smooth' });
            setTimeout(scrollDown, 500);
    };
    
    const scrollUp = (query) => {
        document.querySelector(query).scrollTo({ top: 100000, behavior: 'smooth' });
        setTimeout(scrollDown, 500);
    };

    const observer = new MutationObserver(logNewUsers);
    
    const memberList = document.querySelector('div[role="list"][aria-label="Membros"]');
    if (memberList) {
        observer.observe(memberList, { childList: true, subtree: true });
        console.log("✅ Observando a lista de membros...");
        logNewUsers();
        scrollDown('.membersWrap_c8ffbb .scrollerBase__99f8c');
    } else {
        console.error("❌ Lista de membros não encontrada!");
    }
console.log(seenUsers)
}
)();

// tem que scrolar para achar alguns canais...
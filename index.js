(async () => {
    const serverName = /round table/i;
    const memberListScrollQuery = '.membersWrap_c8ffbb .scrollerBase__99f8c';
    const serverMainChat = 'a[href="/channels/1318374478270562368/1318738271332991056"]';
    const serverList = "Mostrar lista de membros";
    const seenUsers = new Map();

    const scrollUntilEnd = async (query, step, delay = 300) => {
        const el = document.querySelector(query);
        if (!el) {
            console.error("Element not found!");
            return;
        }
    
        let previousScrollTop = -1;
    
        while (true) {
            el.scrollBy({ top: step, behavior: 'smooth' });
            await new Promise(resolve => setTimeout(resolve, delay));
    
            const currentScrollTop = el.scrollTop;
    
            if (Math.abs(currentScrollTop - previousScrollTop) < 5) {
                console.log("✅ Scroll completed!");
                break;
            }
    
            previousScrollTop = currentScrollTop;
        }
    };

    const getOneMonthAgoDate = () => {
        const today = new Date();
        const oneMonthAgo = new Date(today);
        oneMonthAgo.setMonth(today.getMonth() - 1);
    
        if (oneMonthAgo.getMonth() === today.getMonth()) {
            oneMonthAgo.setDate(0);
        }
    
        return new Intl.DateTimeFormat('pt-BR').format(oneMonthAgo);
    };

    // Only works for non-clustered servers
    const findServer = async () => {
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
            console.log(`✅ Server:"${serverElement.getAttribute('aria-label')}" open!`);
        } else {
            console.error(`❌ Server with name similar to ${serverName} not found!`);
        }
    }

    const getAllMembers = async () => {
        await scrollUntilEnd('#channels', -10000)
        document.querySelector(serverMainChat).click();

        const serverMembersList = document.querySelector(`div[role="button"][aria-label="${serverList}"]`);
        if (serverMembersList){
            serverMembersList.click();
            console.log(`✅ Member list open!`);
        } else {
            console.log(`✅ Member list already open!`);
        }

        await new Promise(resolve => setTimeout(resolve, 2000));

        const logNewUsers = () => {
            const members = document.querySelectorAll('span.name__5d473.username__703b9.desaturateUserColors__41f68[style*="color: rgb(46, 204, 113);"]');
            members.forEach(member => {
                const username = member.textContent.trim();
                if (!seenUsers.has(username)) {
                    seenUsers.set(username, false);
                    console.log(username);
                }
            });
        };
        
        const observer = new MutationObserver(logNewUsers);
        
        const memberList = document.querySelector('div[role="list"][aria-label="Membros"]');
        await scrollUntilEnd(memberListScrollQuery, -10000)
        if (memberList) {
            observer.observe(memberList, { childList: true, subtree: true });
            console.log("✅ Looking at the list of members...");
            logNewUsers();
            await scrollUntilEnd(memberListScrollQuery, 200);
        } else {
            console.error("❌ Member list not found!");
        }
    }

    await findServer()
    await getAllMembers()
}
)();

// tem que scrolar para achar alguns canais...
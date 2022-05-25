interface Veiculo{
    nome:string;
    placa:string;
    entrada: Date | string;
}

(function () {

    const $ = (query: string): HTMLInputElement | null => document.querySelector(query);
    function patio() {

        function calcTempo(mil: number){
            const min = Math.floor(mil / 60000);
            const sec = Math.floor((mil % 60000)/1000);
            return `${min}m e ${sec}s`
        }
        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : []
        }
        function salvar(veiculos: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculos))
        }

        function adicionar(veiculo: Veiculo & { cupom?: string }, salvo?: boolean) { 

            const row = document.createElement("tr");
            
            row.innerHTML = `
                <td>${veiculo.nome}</td>
                <td>${veiculo.placa}</td>
                <td>${veiculo.entrada}</td>
                <td>
                    <button class="delete" data-placa="${veiculo.placa}">X</button>
                </td>
            `;
            $("#patio")?.appendChild(row);


            console.log("adicionando");
            if(salvo)
            salvar([...ler(), veiculo])
        
            row.querySelector(".delete")?.addEventListener("click", function (){
                remover(this.dataset.placa);
            })
        }
        
     
        function remover(placa: string) {
            const {entrada, nome} = ler().find(veiculo => veiculo.placa === placa);
            const tempo = calcTempo(new Date().getTime()-new Date(entrada).getTime());
            
            if(!confirm(`O veículo ${nome} permaneceu por ${tempo}. Deseja encerrar?`)){
                return
            } else{
                salvar(ler().filter((veiculo) => veiculo.placa !== placa));

            }

        }


        
        function render() { 
            $("#patio")!.innerHTML = "";
            const patio = ler();

            if(patio.length) {
                patio.forEach((veiculo => adicionar(veiculo)))
            }


        }
        return {ler, adicionar, remover, salvar, render };
    }
    patio().render();
    $("#cadastrar")?.addEventListener("click", () => {
        const nome = $("#nome")?.value;
        const placa = $("#placa")?.value;
        console.log({ nome, placa });
        if (!nome || !placa) {
            alert("Os campos nome e placa sao obrigatórios")
            return;
        }
        patio().adicionar({nome, placa, entrada: new Date().toISOString()}, true);
        
    })

})();
window.AllCharas = {
    charaList: {
        dex: new CharaItem({
            name: 'Dex',
            species: 'Australian Shepherd',
            pronouns: 'she/her',
            location: 'wanderer',
            description: 'lor ipsum dolor sin amet'
        }),
        birdy: new CharaItem({
            name: 'Birdy',
            species: 'Devon Rex',
            pronouns: 'she/her',
            location: 'wanderer',
            description: 'lor ipsum dolor sin amet'
        }),
    }
}

class Charas{
    mountCharas(){
        chara.keys(this.charaList).forEach(key => {
            let chara = this.charaList[key];
            chara.id = key;
            
        })
    }
}

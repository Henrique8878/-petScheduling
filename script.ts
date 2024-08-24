
interface AppointmentsData{
  id:number,
  name:string,
  namePet:string,
  tel:string,
  description:string,
  date:string,
  hour:string
}

const btnNewAgend = document.getElementById("btnNewAgend") as HTMLButtonElement | null;
const btnAgend = document.getElementById("btnAgend")as HTMLButtonElement | null;
const sectionHidden = document.getElementById("sectionAbsolute")as HTMLDivElement | null
const inpName = document.getElementById("inpName") as HTMLInputElement | null
const inpNamePet = document.getElementById("inpNamePet")as HTMLInputElement | null
const inpTel = document.getElementById("inpTel")as HTMLInputElement | null
const inpDescription = document.getElementById("inpDescription")as HTMLInputElement | null
const inpDate = document.getElementById("inpDate")as HTMLInputElement | null
const inpHour = document.getElementById("inpHour")as HTMLInputElement | null
const main = document.querySelector("main")as HTMLInputElement | null
const inpChangeDate = document.getElementById("inpChangeDate")as HTMLInputElement | null


    async function getAppointments(){
      try{
        let response = await fetch("http://localhost:3000/appointments")
        if(!response.ok){
          throw new Error("Erro na requisição GET")
        }else{
          let data:AppointmentsData[] = await response.json()
          for(let obj of data){
            if(inpChangeDate){
              let sectionsContents = document.querySelectorAll(".sectionContent")
                  for(let i = 0;i<sectionsContents.length;i++){
                    if(sectionsContents[i].getAttribute("data-info")==inpChangeDate.value){
                       let sectionPick = sectionsContents[i]
                        if(sectionPick instanceof HTMLElement){
                          sectionPick.style.display="initial"
                        }
                    }else{
                      let sectionPick = sectionsContents[i]
                        if(sectionPick instanceof HTMLElement){
                          sectionPick.style.display="none"
                      }
                    }
                  }
              }
          }
          return data
        }
      }catch(e){
        console.error(`ERRO: ${e}`)
      }
    }

    async function postAppointments(name:string,namePet:string,tel:string,description:string,date:string,hour:string){
      await fetch("http://localhost:3000/appointments",{
        method:`POST`,
        headers:{
          "content-type":"application/json"
        },
        body:JSON.stringify({
          id:new Date().getTime().toString(),
          name:name,
          namePet:namePet,
          tel:tel,
          description:description,
          date:date,
          hour:hour
        })
      })
    }

    async function deleteAppointments(id:string){
      fetch(`http://localhost:3000/appointments/${id}`,{
        method:`DELETE`
      })
    }

    function clearInputs(){
      if(inpName&&inpNamePet&&inpDate&&inpDescription&&inpHour&&inpTel){
        inpName.value=""
        inpNamePet.value=""
        inpDate.value=""
        inpDescription.value=""
        inpHour.value=""
        inpTel.value=""
      }

    }

   
    async function createAppointmentsHtml(){
      let dataArray:AppointmentsData[]|undefined = await getAppointments()
      if(dataArray){
        for(let obj of dataArray){
            let section = document.createElement("section")
            section.setAttribute(`data-info`,`${obj.date}`)
            section.classList.add("sectionContent")
            
              let articleFirst = document.createElement("article")
                let divFirst = document.createElement('div')
                  let imgFirst = document.createElement("img")
                  let spanFirst = document.createElement("span")
                  spanFirst.classList.add("spanPeriod")
                  spanFirst.textContent = definePeriod(obj.hour).period
                let spanFirstChild = document.createElement("span")  
                spanFirstChild.textContent = definePeriod(obj.hour).timeSlot

              let articleSecond = document.createElement("article")
              articleSecond.classList.add("articleSecondContent")
                let divSecond = document.createElement("div")
                  let spanSecond = document.createElement("span")
                  spanSecond.textContent = definePeriod(obj.hour).hourFormated
                  let spanSecond2 = document.createElement("span")
                  spanSecond2.textContent = obj.namePet
                  let spanSecond3 = document.createElement("span")
                  spanSecond3.classList.add("notEmphasis")
                  spanSecond3.textContent = `/${obj.name}`
                let divThird = document.createElement("div")
                divThird.classList.add("breakDivContent")
                  let divThirdChild = document.createElement("div")
                    let spanThird = document.createElement("span")
                    spanThird.classList.add("notEmphasis")
                    spanThird.textContent = obj.description
                  let divThirdChild2 = document.createElement("div")
                    let spanThird2 = document.createElement("span")
                    spanThird2.classList.add("notEmphasis")
                    spanThird2.classList.add("spanRight")
                    spanThird2.textContent = "Remover agendamento"
                    spanThird2.setAttribute(`id`,`${obj.id}`)
                    
                    imgFirst.src = definePeriod(obj.hour).url
                    divThirdChild2.append(spanThird2)
                    divThirdChild.append(spanThird)
                    divThird.append(divThirdChild,divThirdChild2)
                    spanSecond2.append(spanSecond3)
                    divSecond.append(spanSecond,spanSecond2)
                    articleSecond.append(divSecond,divThird)
                    divFirst.append(imgFirst,spanFirst)
                    articleFirst.append(divFirst,spanFirstChild)
                    section.append(articleFirst,articleSecond)
                    if(main){
                      main.append(section)
                    }
                    
        }
      }
    }

  
    function definePeriod(hour:string){
      let period:string = ""
      let timeSlot:string = ""
      let hourFormated:string = ""
      let url:string = ""
      let hourNumber:number = Number(hour)
          function formatHour(hour:number){
            let hourFormated
            if(hour<10){
              hourFormated = `0${hour.toString()}:00`
            }else{
              hourFormated = `${hour.toString()}:00`
            }
            return hourFormated
          }
        if(hourNumber<=12){
          period = "Manhã"
          timeSlot = "09h-12h"
          hourFormated = formatHour(hourNumber)
          url = "./assets/Sun Fog.png"
        }else if(hourNumber>12 && hourNumber<=18){
          period = "Tarde"
          timeSlot = "12h-18h"
          hourFormated = formatHour(hourNumber)
          url = "./assets/Cloud-Sun-4--Streamline-Solar.png"
        }
      return {period,timeSlot,hourFormated,url} 
    }

 
    if(inpDate){
      inpDate.addEventListener("input",async ()=>{
        let data = await fetch("http://localhost:3000/appointments")
        let dataJSON = await data.json()
          for(let obj of dataJSON){
              if(obj.date==inpDate.value){
                  let options = document.querySelectorAll(".optTime")
                    for(let i = 0;i<options.length;i++){
                        let optionValid = options[i] as HTMLOptionElement
                        let optionValue = optionValid.textContent
                          if(optionValue==definePeriod(obj.hour).hourFormated){
                              options[i].setAttribute("disabled","true")
                          }
                    }
              }
          }
      })
    }
    if(inpChangeDate){
      inpChangeDate.addEventListener("input",()=>{
        getAppointments()
      })
    }

    if(main){
      main.addEventListener("click",async(e)=>{
        if(e.target instanceof HTMLElement){
          let dataArray:AppointmentsData[] | undefined = await getAppointments()
            if(dataArray){
              for(let obj of dataArray){
                if(obj.id.toString()==e.target.id){
                  deleteAppointments(e.target.id)               
                }
              }
            }
        }
      })
    }

    if(inpTel){
      inpTel.addEventListener("input",(e)=>{
        const regex = /^\(\d{2}\)\s*\d\s*\d{4}-\d{4}$/;
        if(e.target instanceof HTMLInputElement){
          try{
            
          }catch(e){
            alert(e)
          }
        }
      })
    }

    if(inpName){
      inpName.addEventListener("input",(e)=>{
        if(e.target instanceof HTMLInputElement){
          const regex = /^[A-Za-z]+$/;
          if(!(regex.test(e.target.value))){
            inpName.value = inpName.value.replace(e.target.value,"")
          }
        }
      })
    }

    if(inpNamePet){
      inpNamePet.addEventListener("input",(e)=>{
        if(e.target instanceof HTMLInputElement){
          const regex = /^[A-Za-z]+$/;
          if(!(regex.test(e.target.value))){
            inpNamePet.value = inpNamePet.value.replace(e.target.value,"")
          }
        }
      })
    }

    if(inpDescription){
      inpDescription.addEventListener("input",(e)=>{
        if(e.target instanceof HTMLTextAreaElement){
          const regex = /^[a-zA-Z\s]+$/;
          if(!(regex.test(e.target.value))){
            inpDescription.value = inpDescription.value.replace(e.target.value,"")
          }
        }
      })
    }

    if (btnNewAgend && sectionHidden) {
    btnNewAgend.addEventListener("click", () => {
      sectionHidden.style.display = "flex";
    });
    }
  
    if (btnAgend && sectionHidden && inpName && inpNamePet && inpTel && inpDescription && inpDate && inpHour ) {
        btnAgend.addEventListener("click", () => {

        try{
          if(inpName.value==""||inpNamePet.value==""||inpDate.value==""||inpDescription.value==""||inpHour.value==""||inpTel.value==""){
            throw new Error("Preencha todos os campos!")
          }else{
           
            const regex = /^\(\d{2}\)\s*\d\s*\d{4}-\d{4}$/;
            if(inpTel){
              try{
                if(!(regex.test(inpTel.value))){
                  throw new Error("Preencha o telefone no formato (00) 0 0000-0000")
                }else{
                  postAppointments(inpName.value,inpNamePet.value,inpTel.value,inpDescription.value,inpDate.value,inpHour.value)
                  sectionHidden.style.display = "none";
                  createAppointmentsHtml()
                }
              }catch(e){
                alert(e)
                clearInputs()
                sectionHidden.style.display = "none";
              }
            }
          }
        }catch(e){
          alert(e)
          clearInputs()
          sectionHidden.style.display = "none";
        }
    });
        getAppointments()
    }

    createAppointmentsHtml()
  

 










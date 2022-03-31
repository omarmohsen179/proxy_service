import React, { useState, useEffect } from "react";
import { CheckBox } from 'devextreme-react/check-box';
import List from 'devextreme-react/list';
import MasterTable from './MasterTable'
import ArrayStore from 'devextreme/data/array_store';
const ListTable = ({
    _className = "",
    selectionMode = "single",
    dataSource,
}) => {
    const [keys, setData] = useState([]);
    const [selected, setselected] = useState([]);
    const [tabledata, settabledata] = useState([
        {id:'',name:'',date:''},
        
    ]);
    const [colAtt, setcolAtt] = useState([]);
   
    useEffect(() => {
        if(dataSource.length>0)
        setData(Object.keys(dataSource[0]));
        setcolAtt([])
    }, []);

    function selecteditem(args){
         setselected(args)
    }
   function onSelectedItemsChange(args) {
        if(args.name === 'selectedItems') {
       setselected (args.value);
       console.log(selected)
            let x= []
            let st=args.value[args.value.length-1]
            console.log(st)
            if(x.length<=keys.length){
                for(let j=0;j<args.value.length;j++){
                  x.push({caption:args.value[j],field:args.value[j]})
                 }
     
                      setcolAtt(x)
            }
        
          let y=[];
            for(let i=0;i<dataSource.length;i++){
                let c={}
                for(let j=0;j<args.value.length;j++){
                    c[args.value[j]]=dataSource[i][args.value[j]]
                 }
                y.push(c)
            }
          

          settabledata(y)
    
        }

    }
    return (
        <div>
            <div style={{width:"20%",height:"100%"}}>
            <List
            dataSource={keys}
            showSelectionControls={true}
            selectionMode="multiple"
            selectedItems={selected}
            onOptionChanged={onSelectedItemsChange}>
          </List>
            </div>
            <div>
            <MasterTable
            dataSource={tabledata}
            colAttributes={colAtt}
            />
            </div>

           
        </div>
    );
};
/*
    <MasterTable
            dataSource={data}
            colAttributes={a}
            />
           {data.map((inli,index) => 
           
            <div onClick={cheng}>
                {inli}
     
            </div>
            
           )

            }*/
export default ListTable;

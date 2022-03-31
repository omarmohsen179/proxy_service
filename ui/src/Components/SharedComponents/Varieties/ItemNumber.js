// import React, { useState } from 'react';
// import { Button } from 'devextreme-react/button';
// import List from 'devextreme-react/list';
// import { NumberBox } from 'devextreme-react';
// import notify from 'devextreme/ui/notify';
// import { Popup } from 'devextreme-react/popup';
// import ConfirmModal from '../SharedComponents/ConfirmModal';

// function ItemTemplate(data) {
//   return <div className='text-center'>{data.parcode_s}</div>;
// }

// const ItemNumber = () => {
//   let [items, setItems] = useState([])
//   let [selectedItem, setSelectedItem] = useState({ parcode_s: '' })
//   let [item, setItem] = useState({ parcode_s: '' })
//   let [edit, setEdit] = useState(false)
//   let [popupVisible, setPopupVisible] = useState(false)

//   let handleAddItem = () => {
//     if (item.parcode_s) {
//       let isExisted = items.find(e => e.parcode_s === item.parcode_s);
//       if (!isExisted) {
//         if (edit) {
//           let i = selectedItem.index;
//           items[i].parcode_s = item.parcode_s;
//           setEdit(false);
//         } else {
//           setItems([...items, { ...item, index: items.length }])
//           setItem({ parcode_s: '' })
//         }
//       }
//       else {
//         notify({ message: 'رقم القطعة موجود مسبقا', width: 600 }, "error", 300)
//       }
//     }
//   }

//   let handleSelect = ({ itemData }) => {
//     setSelectedItem(itemData);
//   }

//   let handleEdit = () => {
//     setEdit(true)
//     setItem(selectedItem)
//   }

//   let handleDelete = () => {
//     let filterdItems = items.filter(e => e.parcode_s !== selectedItem.parcode_s)
//     setItems(filterdItems)
//   }

//   let togglePopup = () => {
//     setPopupVisible(!popupVisible);
//   }

//   return (

//     <>
//       <div className='side-menu custom-card'>
//         <div className='side-menu__label'>
//           رقم القطعة
//                     </div>
//         <div className='card-body'>
//           <List
//             dataSource={items}
//             itemRender={ItemTemplate}
//             onItemClick={handleSelect}
//           />
//         </div>
//         <div className='side-menu__input '>
//           <NumberBox value={item.parcode_s}
//             onEnterKey={handleAddItem}
//             onValueChange={(e) => setItem({ parcode_s: e })}
//           />
//           <div className='center py-3'>
//             <Button
//               width={'49%'}
//               text="تعديل"
//               type="default"
//               stylingMode="outlined"
//               onClick={handleEdit}
//             />

//             <Button
//               width={'49%'}
//               text="حذف"
//               type="danger"
//               stylingMode="outlined"
//               onClick={togglePopup}
//             />
//           </div>
//         </div>
//       </div>

//       {/* confirm modal */}
//       <ConfirmModal message='هل تريد حذف هذا العنصر' popupVisible={popupVisible} togglePopup={togglePopup} callBack={handleDelete} />
//     </>
//   );
// }

// export default ItemNumber;


import React, { useState } from 'react';
import { Button } from 'devextreme-react/button';
import List from 'devextreme-react/list';
import { NumberBox } from 'devextreme-react';
import notify from 'devextreme/ui/notify';
import ConfirmModal from '../SharedComponents/ConfirmModal';
import Validator, {

  CustomRule
} from 'devextreme-react/validator';
import CellError from '../SharedComponents/CellError';

let error = true;
function ItemTemplate(data) {
  return (
    <>
      <div className='text-center dx-theme-accent-as-border-color'>{data.parcode_s}</div>
      <div className='text-danger'>رقم القطعة موجود مسبقا </div>
    </>
  )
}

// let validateLogin = (params) => {
// axios.post(
//   'https://www.example.com/services/validate-login',
//   JSON.stringify({
//     login: params.value
//   }),
//   requestConfig
// ).then(response => {
//   params.rule.isValid = response.data['result'];
//   params.rule.message = response.data['message'];
//   params.validator.validate();
// })
//   return true;
// }

const ItemNumber = ({ items, save, remove }) => {

  let [item, setItem] = useState('')
  let [selectedItem, setSelectedItem] = useState({})
  let [edit, setEdit] = useState(false)
  let [popupVisible, setPopupVisible] = useState(false)


  let handleAddItem = () => {
    if (item) {
      let isExisted = items.find(e => e.parcode_s === item);
      if (!isExisted) {
        if (edit) {
          save({ name: 'Items_s2', value: { parcode_s: item, key: selectedItem.key } })
          setEdit(false)
        } else {
          save({ name: 'Items_s2', value: { parcode_s: item } })
        }
        setItem('')
      }
      else {
        notify({ message: 'رقم القطعة موجود مسبقا', width: 600 }, "error", 300)
      }
    }
  }

  let handleSelect = ({ itemData }) => {
    setSelectedItem(itemData);
  }

  let handleEdit = () => {
    setEdit(true)
    setItem(selectedItem.parcode_s)
  }

  let handleDelete = () => {
    remove({ name: 'Items_s2', value: selectedItem });
  }

  let togglePopup = () => {
    setPopupVisible(!popupVisible);
  }

  return (
    <>
      <div className='custom-card'>
        <div className='side-menu__label'>
          رقم القطعة
        </div>
        <div className='side-menu__body'>
          <ul className="list-group list-group-flush">
            {
              items.map((e, i) => <li key={i}
                className={e.error ? `list-group-item cell-error` : `list-group-item `}
                onClick={() => handleSelect({ itemData: e, itemIndex: i })}
              >
                <div className='center'>
                  {e.parcode_s}
                  {e.error &&
                    <CellError message='هذا الرقم موجود مسبقا' />
                  }
                </div>
              </li>)
            }
          </ul>

        </div>
        <div className='side-menu__input '>
          <NumberBox value={item}
            onEnterKey={handleAddItem}
            onValueChange={(e) => setItem(e)}
          />

          <div className='center py-3'>
            <Button
              width={'49%'}
              text="تعديل"
              type="default"
              stylingMode="outlined"
              onClick={handleEdit}
            />

            <Button
              width={'49%'}
              text="حذف"
              type="danger"
              stylingMode="outlined"
              onClick={togglePopup}
            />
          </div>
        </div>
      </div>

      <ConfirmModal message='هل تريد حذف هذا العنصر' popupVisible={popupVisible} togglePopup={togglePopup} callBack={handleDelete} />
    </>
  );
}

export default ItemNumber;



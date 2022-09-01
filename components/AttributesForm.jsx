import React, { useEffect, useState } from "react";
import ReactSelect from 'react-select'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { API_URL } from '../../constants.jsx';

const AttributesForm = (props) => {
  const { damn, setDamn, attributes, addAttribute, attributeCategory, allAttributes } = props;

  const [attributeChoice, setAttributeChoice] = useState([]);
  const [listAttribut, setlistAttribut] = useState([]);



  const [listAttributSelected, setlistAttributSelected] = useState([{ quantity: 0, id: null }]);


  const [listTabAtr, setListTabAtr] = useState([]);
  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <div>{children}</div>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


  const [valueAtr, setValueAtr] = React.useState(0);
  const [value, setValue] = React.useState(0);
  const [currentAttribut, setCurrentAttribut] = React.useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setListTabAtr(allAttributes.allAttributes?.filter((attribute) => attribute.category === attributeCategory.categories[newValue].name))
  };
  const handleChangeAtr = (attributSelected) => {
    setCurrentAttribut(attributSelected)
    // switch (attributSelected.category) {
    //   case 'Nose':
    //     if(attributSelected.image){setImage(attributSelected.image)} else {setImage('src/assets/nose/Boy Nose.png')}
    //     break;
    //   case 'Mouth':
    //     if(attributSelected.image){setImage(attributSelected.image)} else {setImage()}
    //     break;
    //   case 'Eyes':
    //     if(attributSelected.image){setImage(attributSelected.image)} else {setImage()}
    //     break;
    //   case 'Skin':
    //     if(attributSelected.image){setImage(attributSelected.image)} else {setImage()}
    //     break;
    //   case 'Hair':
    //     if(attributSelected.image){setImage(attributSelected.image)} else {setImage()}
    //     break;
    //   case 'Headwear':
    //     if(attributSelected.image){setImage(attributSelected.image)} else {setImage()}
    //     break;
    //   default:
    //     break;
    // }
    setValueAtr(listTabAtr.indexOf(attributSelected));
  };

  const handleAttributAdded = (attribut) => {
    setlistAttributSelected(prevState => {
      const newState = prevState.map(obj => {
        if (obj.id === attribut.id) {
          return { ...obj, quantity: quantity++ };
        }
        return obj;
      });

      return newState;
    });
    console.log(listAttributSelected)
  };
  // const handleAttributRemoved= (attribut) => {
  //    setlistAttributSelected(listAttributSelected => [...listAttributSelected, attribut]);
  // };

  const displayTabs = () => {
    return (listTabAtr?.map((attribut) =>
      <div className="w-32 flex" >
        <span>{listAttributSelected[0]?.quantity}</span>
        <img height="40" width="40" onClick={() =>handleChangeAtr(attribut)} src={attribut.image} alt="image-preview" />
        <button onClick={() =>handleAttributAdded(attribut)} className=" rounded-full  w-5 text-white btn-cta ">
          -
        </button>
        <button onClick={() =>handleAttributAdded(attribut)} className=" rounded-full  mx-1 w-5 text-white btn-cta ">
          +
        </button>

      </div>
    ));
  };




  const listItemsSec = allAttributes.allAttributes?.map((number) =>
    <Tab style={{ color: 'white' }} label={number.name} {...a11yProps(number.id)} />);

  const listItems = attributeCategory.categories?.map((category) =>
    <Tab style={{ color: 'white' }} label={category.name} {...a11yProps(category.id)} />);



  // if (damn.loading) return <p>We are still loading you Dan's attributes, please check again shortly</p>;
  if (!attributes || attributes.length === 0) return <p>No attributes, sorry</p>;
  return (
    <Box sx={{ display: 'flex' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" orientation="vertical">

          {listItems}

        </Tabs>
      </Box>
      <TabPanel value={value} index={value}>
        <Tabs value={valueAtr}   aria-label="basic tabs example" orientation="vertical">
          {displayTabs(value)}
        </Tabs>
      </TabPanel>


      <div className='w-full flex items-center justify-center text-center'>
      
        <div className='bg-black min-h-300'>
        <div className="my-8">
            RECAP
            <ul>
              <li>{damn.hair} </li>
              <li>{damn.nose}</li>
              <li>{damn.mouth}</li>
              <li>{damn.eyes}</li>
            </ul>
          </div>
          <p className="my-8 text-white font-medium  text-3xl">Preview:</p>
          {/* <img height="300" width="300" src={API_URL + '/preview/'+damn.hair+'x'+damn.eyes+'x'+damn.nose+'x'+damn.mouth+'x'+damn.skin} alt="image-preview" /> */}
          <div className="relative">
            <img height="300" width="300" className="z-0 absolute" src={`src/assets/skin/${damn.skin ? damn.skin : 'White'}.png`} alt="image-preview" />
            <img height="300" width="300" className="z-10 absolute" src={`src/assets/hair/${damn.hair ? damn.hair : 'Rasta'}.png`} alt="image-preview" />
            <img height="300" width="300" className="z-10 absolute" src="src/assets/nose/Boy Nose.png" alt="image-preview" />
            <img height="300" width="300" className="z-10 absolute" src={`src/assets/mouth/${damn.mouth ? damn.mouth : 'Big Mouth'}.png`} alt="image-preview" />
            {currentAttribut.image &&
              <img height="300" width="300" className="z-10 absolute" src={currentAttribut.image} />
            }
            <img height="300" width="300" className="z-10 relative" src={`src/assets/eyes/${damn.eyes ? damn.eyes : 'Evil'}.png`} alt="image-preview" />


          </div>
         
          <button onClick={addAttribute} className="px-3 py-2 rounded-md text-lg font-medium bg-gray-900 text-white btn-cta my-4">
            Buy attributes
          </button>
        </div>
      </div>
    </Box>


  );



  // const customStyles = {
  //   option: (provided, state) => ({
  //     ...provided,
  //     color: '#000',
  //     zIndex : 100
  //   }),
  //   menu: (provided, state) => ({
  //     ...provided,
  //     width: state.selectProps.width,
  //     color: state.selectProps.menuColor,
  //     zIndex : 100
  //   }),
  //   control: () => ({
  //     width: 200,
  //     zIndex : 100
  //   }),
  //   singleValue: (provided, )=> ({
  //     ...provided,
  //     color: '#fff',
  //     zIndex : 100
  //   }),
  // }

  // if (damn.loading) return <p>We are still loading you Dan's attributes, please check again shortly</p>;
  // if (!attributes || attributes.length === 0) return <p>No attributes, sorry</p>;
  // return (
  //   <div className="bg-black mt-5 pl-2 pr-2 rounded-md">
  //     <div className='w-full'>
  //       <h2 className='list-head bg-black text-white mb-2'>Attributes</h2>
  //       { 
  //         Object.keys(attributes).map((result, currentKey) => {

  //           switch (currentKey) {
  //             case 0: 
  //               var attributeValue = damn.hair;
  //               break;
  //             case 1: 
  //               var attributeValue = damn.eyes;
  //               break;
  //             case 2: 
  //               var attributeValue = damn.nose;
  //               break;
  //             case 3: 
  //               var attributeValue = damn.mouth;
  //               break;
  //             case 4: 
  //               var attributeValue = damn.skin;
  //               break;
  //           }

  //           attributeChoice[currentKey] = attributeValue;

  //           const optList = Object.keys(attributes[result]).map(x => ({label: attributes[result][x].value, value: attributes[result][x].id}))

  //           return (
  //             <div className="float-left bg-gray text-white z-20" key={currentKey}>    {result}
  //               <ReactSelect
  //                 value={attributeValue ? optList.filter(attribute => attribute.value == attributeValue) : null}
  //                 styles={customStyles}
  //                 options={optList}
  //                 onChange={event => {
  //                     attributeChoice[currentKey] = event.label;
  //                     listAttribut[currentKey] = {label: event.label, type: "Nose", nb:0}
  //                     setlistAttribut(listAttribut)
  //                     console.log(listAttribut)
  //                     console.log(attributeChoice)
  //                     setAttributeChoice(attributeChoice);
  //                     setDamn({ 
  //                       id: damn.id, 
  //                       image_url: damn.image_url,
  //                       hair:   attributeChoice[0],
  //                       eyes:   attributeChoice[1],
  //                       nose:   attributeChoice[2],
  //                       mouth:  attributeChoice[3],
  //                       skin:   attributeChoice[4]
  //                     });
  //                   }
  //                 }
  //               />
  //             </div>
  //           )
  //         })
  //       } 

  //     </div>z
  //     <div className='w-full flex items-center justify-center text-center'>
  //       <div className='bg-black min-h-300'>

  //       <p className="my-8 text-white font-medium  text-3xl">Preview:</p>
  //         {/* <img height="300" width="300" src={API_URL + '/preview/'+damn.hair+'x'+damn.eyes+'x'+damn.nose+'x'+damn.mouth+'x'+damn.skin} alt="image-preview" /> */}
  //         <div  className="relative">
  //         <img height="300" width="300" className="z-0 absolute" src={`src/assets/skin/${damn.skin? damn.skin : 'White'}.png`} alt="image-preview" />
  //         <img height="300" width="300" className="z-10 absolute" src={`src/assets/hair/${damn.hair? damn.hair : 'Rasta'}.png`} alt="image-preview" />
  //         <img height="300" width="300" className="z-10 absolute" src={`src/assets/nose/${damn.nose? damn.nose : 'Boy Nose'}.png`} alt="image-preview" />
  //         <img height="300" width="300" className="z-10 absolute" src={`src/assets/mouth/${damn.mouth? damn.mouth : 'Big Mouth'}.png`} alt="image-preview" />
  //         <img height="300" width="300" className="z-10 relative" src={`src/assets/eyes/${damn.eyes? damn.eyes : 'Evil'}.png`} alt="image-preview" />
  //         </div>
  //         <div className="my-8">
  //           You chose the following attribute: 
  //           <ul>
  //             {/* {console.log(listAttribut)}
  //           {  listAttribut.map(att => <li>{att.label}{att.nb}</li>)} */}
  //             <li>{damn.hair} *2      - 2 +</li>
  //             <li>{damn.nose}</li>
  //             <li>{damn.mouth}</li>
  //             <li>{damn.eyes}</li>
  //           </ul>
  //         </div>
  //         <button onClick={addAttribute} className="px-3 py-2 rounded-md text-lg font-medium bg-gray-900 text-white btn-cta my-4">
  //         Buy attributes
  //       </button>
  //       </div>
  //     </div>
  //   </div>
  // );
};
export default AttributesForm;
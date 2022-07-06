import { render, screen } from '@testing-library/react';
import InputWrapper from "Components/InputWrapper/InputWrapper"

//mock props
const key = "flow_vol"
const fieldData = {
    "value": {
      "index": [
        [
          0
        ]
      ],
      "value": [
        0.0003286
      ],
      "bounds": [
        [
          null,
          null
        ]
      ]
    },
    "display_name": "flow_vol",
    "description": "Volumetric flowrate in feed",
    "display_units": "m<sup>3</sup>/s",
    "indices": [],
    "scale_factor": 0,
    "to_units": "",
    "readonly": false,
    "category": ""
  }

test('test input wrapper', () => {

    render( <InputWrapper key={key} fieldData={fieldData}></InputWrapper> )

    //test for component elements
    screen.getByRole('textbox', {  name: /flow_vol/i});


})
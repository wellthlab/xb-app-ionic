import {
    IonBackButton,
    IonButton,
    IonLabel,
    IonCheckbox,
    IonHeader,
    IonPage,
    IonTitle,
  } from "@ionic/react";
  import React, { Component } from "react";
  import { useEffect } from "react";
  import { useHistory } from "react-router-dom";
  import { WithContext as ReactTags } from 'react-tag-input';
  import "./TagsInput.css";

  const KeyCodes = {
    comma: 188,
    enter: [10, 13],
  };

  const tagsByQuestion = {
      "workoutLocation" : [
        { id: "Park", text: "Park" },
        { id: "Gym", text: "Gym" }
     ],
     "whyScheduling" : [
        { id: "Unusual deadline", text: "Unusual deadline" },
        { id: "Injury", text: "Injury" },
        { id: "Family emergency", text: "Family emergency" },
        { id: "Newborn: no sleep", text: "Newborn: no sleep" }
     ],
     "whyBuilding" : [
        { id: "Exercising more", text: "Exercising more" },
        { id: "Making progress", text: "Making progress" },
     ]

  }
  const delimiters = [...KeyCodes.enter, KeyCodes.comma];

  const TagsInput = (props) => {

    const [tags, setTags] = React.useState(tagsByQuestion[props.tagType]);
     const [suggestions, setSuggestions] = React.useState([
        { id: 'USA', text: 'USA' },
        { id: 'Germany', text: 'Germany' },
        { id: 'Austria', text: 'Austria' },
        { id: 'Costa Rica', text: 'Costa Rica' },
        { id: 'Sri Lanka', text: 'Sri Lanka' },
        { id: 'Thailand', text: 'Thailand' }
     ]);

     const handleDelete = (i) => {
        setTags(tags.filter((tag, index) => index !== i));
        props.onChange("");
      };

      const handleAddition = (tag) => {
        setTags([...tags, tag]);
      };
    
      const handleTagClick = (index) => {

        props.onChange(tags[index].text);
      };

    return (
     <>
     <div>
                
     <ReactTags
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        delimiters={delimiters}
        handleTagClick={handleTagClick}
        suggestions={[]}
        placeholder="Add tag..."
        minQueryLength={2}
        maxLength={5}
        autofocus={false}
        removeComponent={null}
        autocomplete={true}
        readOnly={false}
        allowUnique={true}
        allowDragDrop={true}
        inline={true}
        allowAdditionFromPaste={true}
        tags={tags}
      />
            </div>
  
     </>
     
    
  
    );
  };
  
  export default TagsInput;
  
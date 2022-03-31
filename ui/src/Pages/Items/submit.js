let submit = async (values) => {

    // check values

    //valid make requist

    try {
        let response = await SAVE_ITEMS(values);
        let { id, Items, Items_s2, Items_Box } = response;

        handleChange({ name: "id", value: id });

        if (id && !Items_s2 && !Items_Box) {
            notify({ message: "تم حفظ الصنف بنجاح", width: 600 }, "success", 1000);
        } else {
            if (Items) {
                let errors = {};
                Items.forEach((item) => {
                    let key = Object.keys(item)[0];
                    errors[key] = false;
                });
                setErrors(errors);
            }

            if (Items_s2) {
                let ProcessedList = values["Items_s2"];
                ProcessedList.forEach((e) => {
                    if (Items_s2.some((i) => i.Value == e.parcode_s)) {
                        e.error = true;
                    }
                });
                handleChange({ name: "Items_s2", value: ProcessedList });
            }

            if (Items_Box) {
                let ProcessedList = values["Items_Box"];
                ProcessedList.forEach((e) => {
                    if (Items_Box.some((i) => i.Value == e.parcodee)) {
                        e.error = true;
                    }
                });
                handleChange({ name: "Items_Box", value: ProcessedList });
            }
        }
    } catch (error) {
        console.log(error);
    }
};
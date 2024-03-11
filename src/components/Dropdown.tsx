import React from 'react';

const Dropdown = ({ list, addItem }: {
  list: { id: string, name: string }[],
  addItem: (item: string) => void
}) => {
  return (
    <div id="dropdown" className="flex shadow z-40 w-full rounded-md  bg-base-200 max-h-select overflow-y-auto max-h-64">
      <div className="flex flex-col w-full">
        {list.map((item, key) => {
          return <div key={key}
            className="cursor-pointer w-full  rounded-t hover:bg-teal-100 hover:text-black"
            onClick={() => addItem(item.id)}>
            <div className="flex w-full items-center p-2 pl-2 relative hover:border-teal-100" >
              <div className="w-full items-center flex">
                <div className="mx-2 leading-6">
                  {item.name}
                </div>
              </div>
            </div>
          </div>
        })}
      </div>
    </div>
  );

};

export default Dropdown;
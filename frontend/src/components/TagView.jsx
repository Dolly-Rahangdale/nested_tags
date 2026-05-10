'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronRightIcon, PlusIcon, PencilIcon } from './Icons';

const TagView = ({ node, onUpdate, depth = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(node?.name || '');
  const [isHovered, setIsHovered] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditingName]);

  if (!node || !node.name) {
    console.warn('TagView received invalid node:', node);
    return null;
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleNameClick = () => {
    setIsEditingName(true);
    setEditName(node.name);
  };

  const handleNameChange = (e) => {
    setEditName(e.target.value);
  };

  const handleNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      onUpdate({ ...node, name: editName });
      setIsEditingName(false);
    }
  };

  const handleDataChange = (e) => {
    onUpdate({ ...node, data: e.target.value });
  };

  const addChild = () => {
    if (!node) return;
    
    const newNode = {
      name: 'New Child',
      data: ''
    };

    let updatedNode;
    if (node.children && Array.isArray(node.children)) {
      updatedNode = {
        ...node,
        children: [...node.children, newNode]
      };
    } else {
      const { data, ...nodeWithoutData } = node;
      updatedNode = {
        ...nodeWithoutData,
        children: [newNode]
      };
    }
    onUpdate(updatedNode);
  };

  const getGradientByDepth = (depth) => {
    const gradients = [
      'from-indigo-500 to-purple-600',
      'from-purple-500 to-pink-500',
      'from-pink-500 to-rose-500',
      'from-rose-500 to-orange-500',
      'from-orange-500 to-amber-500'
    ];
    return gradients[depth % gradients.length];
  };

  return (
    <div className="relative transition-all duration-300" style={{ marginLeft: depth > 0 ? '28px' : '0' }}>
      {depth > 0 && (
        <>
          <div className="absolute left-[-14px] top-6 w-3 h-px bg-gradient-to-r from-slate-300 to-transparent"></div>
          <div className="absolute left-[-14px] top-6 bottom-6 w-px bg-gradient-to-b from-slate-300 via-slate-200 to-transparent"></div>
        </>
      )}
      
      <div 
        className="group relative mb-5 animate-slide-up"
        style={{ animationDelay: `${depth * 50}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
          isHovered ? 'border-indigo-300 shadow-premium-hover' : 'border-slate-200 shadow-premium'
        }`}>
          <div className={`bg-gradient-to-r ${getGradientByDepth(depth)} px-5 py-3 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <button
                  onClick={toggleCollapse}
                  className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 flex items-center justify-center text-white hover:scale-105 active:scale-95"
                  aria-label="Toggle collapse"
                >
                  <ChevronRightIcon className={`w-4 h-4 transition-all duration-300 ${!isCollapsed ? 'rotate-90' : ''}`} />
                </button>
                
                {isEditingName ? (
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={editName}
                    onChange={handleNameChange}
                    onKeyPress={handleNameKeyPress}
                    onBlur={() => setIsEditingName(false)}
                    className="bg-white/95 backdrop-blur-sm text-slate-800 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 text-sm font-semibold shadow-sm transition-all duration-200"
                  />
                ) : (
                  <div 
                    onClick={handleNameClick}
                    className="flex items-center gap-2 cursor-pointer group/name py-1 px-1 -ml-1 rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    <span className="text-white font-semibold text-sm tracking-wide">{node.name}</span>
                    <PencilIcon className="w-3.5 h-3.5 text-white/60" />
                  </div>
                )}
              </div>
              
              <button
                onClick={addChild}
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-all duration-200 text-white text-xs font-medium backdrop-blur-sm hover:scale-105 active:scale-95"
                aria-label="Add child"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>Add Child</span>
              </button>
            </div>
          </div>

          <div className="transition-all duration-300 overflow-hidden">
            {!isCollapsed && (
              <div className="p-2 bg-gradient-to-b from-white to-slate-50/30">
                {node.data !== undefined && (
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                      Data Value
                    </label>
                    <input
                      type="text"
                      value={node.data}
                      onChange={handleDataChange}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 text-slate-700 text-sm font-mono placeholder:text-slate-400"
                      placeholder="Enter data value..."
                    />
                  </div>
                )}
                
                {node.children && Array.isArray(node.children) && node.children.length > 0 && (
                  <div className="mt-3 space-y-3 relative">
                    {node.children.map((child, index) => (
                      <TagView
                        key={`${child.name}-${index}`}
                        node={child}
                        onUpdate={(updatedChild) => {
                          const newChildren = [...node.children];
                          newChildren[index] = updatedChild;
                          onUpdate({ ...node, children: newChildren });
                        }}
                        depth={depth + 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagView;
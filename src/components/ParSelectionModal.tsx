import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type ParSelectionModalProps = {
  visible: boolean;
  holes: 9 | 18;
  initialParValues: number[];
  onClose: () => void;
  onApply: (values: number[]) => void;
};

const parOptions = [3, 4, 5];

export default function ParSelectionModal({
  visible,
  holes,
  initialParValues,
  onClose,
  onApply,
}: ParSelectionModalProps) {
  const [localParValues, setLocalParValues] = useState<number[]>([]);

  useEffect(() => {
    if (visible) {
      setLocalParValues(initialParValues);
    }
  }, [visible, initialParValues]);

  const selectPar = (index: number, value: number) => {
    setLocalParValues(prev =>
      prev.map((item, i) => (i === index ? value : item))
    );
  };

  const handleApply = () => {
    onApply(localParValues);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center bg-black/50 px-5">
        <View className="max-h-[85%] rounded-3xl bg-white p-5">
          <Text className="mb-2 text-xl font-bold text-black">
            Select PAR for Each Hole
          </Text>

          <Text className="mb-4 text-sm text-neutral-600">
            Choose 3, 4, or 5 for each hole, then apply it to your scorecard.
          </Text>

          <ScrollView showsVerticalScrollIndicator>
            {Array.from({ length: holes }, (_, index) => (
              <View
                key={`par-row-${index}`}
                className="mb-3 flex-row items-center justify-between rounded-2xl border border-neutral-200 px-4 py-3"
              >
                <Text className="text-base font-semibold text-black">
                  Hole {index + 1}
                </Text>

                <View className="flex-row gap-2">
                  {parOptions.map(option => {
                    const isSelected = localParValues[index] === option;

                    return (
                      <TouchableOpacity
                        key={`${index}-${option}`}
                        className={`rounded-full px-4 py-2 ${
                          isSelected ? 'bg-[#175E39]' : 'bg-neutral-200'
                        }`}
                        onPress={() => selectPar(index, option)}
                      >
                        <Text
                          className={`font-bold ${
                            isSelected ? 'text-white' : 'text-black'
                          }`}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))}
          </ScrollView>

          <View className="mt-5 flex-row justify-end gap-3">
            <TouchableOpacity
              className="rounded-xl bg-neutral-300 px-4 py-3"
              onPress={onClose}
            >
              <Text className="font-semibold text-black">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="rounded-xl bg-[#175E39] px-4 py-3"
              onPress={handleApply}
            >
              <Text className="font-semibold text-white">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
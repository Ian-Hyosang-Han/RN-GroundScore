import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import {
  getScoreColors,
  getTotalScoreDiff,
  getTotalStrokes,
  sumRange,
} from '../utils/scoreCard';
import { useGameSetup } from '../context/GameSetupContext';
import ParSelectionModal from '../components/ParSelectionModal';

type EditingCell =
  | {
      type: 'solo';
      row: 'on' | 'putt';
      index: number;
      value: number;
    }
  | {
      type: 'group';
      playerId: string;
      index: number;
      value: number;
    }
  | null;

function formatScoreValue(value: number) {
  return value > 0 ? `+${value}` : `${value}`;
}

function ScoreCell({ value, onPress }: { value: number; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="w-12 items-center justify-center border-r border-neutral-300 px-2 py-3"
      onPress={onPress}
    >
      <Text className="text-center">{value}</Text>
    </TouchableOpacity>
  );
}

function ParCell({ value, onPress }: { value: number; onPress: () => void }) {
  return (
    <TouchableOpacity
      className="w-12 items-center justify-center border-r border-neutral-300 bg-green-50 px-2 py-3"
      onPress={onPress}
    >
      <Text className="text-center font-bold text-[#175E39]">{value}</Text>
    </TouchableOpacity>
  );
}

function TotalCell({ total }: { total: number }) {
  return (
    <View className="w-16 items-center justify-center border-r border-neutral-300 bg-green-100 px-2 py-3">
      <Text className="text-center font-bold text-[#175E39]">{total}</Text>
    </View>
  );
}

function ScoreResultCell({ value }: { value: number }) {
  const colors = getScoreColors(value);

  return (
    <View
      className="w-12 items-center justify-center border-r px-1 py-3"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <Text className="text-center font-bold" style={{ color: colors.text }}>
        {formatScoreValue(value)}
      </Text>
    </View>
  );
}

function ScoreTotalCell({ total }: { total: number }) {
  const colors = getScoreColors(total);

  return (
    <View
      className="w-16 items-center justify-center border-r px-2 py-3"
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <Text className="text-center font-bold" style={{ color: colors.text }}>
        {formatScoreValue(total)}
      </Text>
    </View>
  );
}

function GroupEditableScoreCell({
  value,
  onPress,
}: {
  value: number;
  onPress: () => void;
}) {
  const colors = getScoreColors(value);

  return (
    <TouchableOpacity
      className="w-12 items-center justify-center border-r px-1 py-3"
      onPress={onPress}
      style={{
        backgroundColor: colors.bg,
        borderColor: colors.border,
      }}
    >
      <Text className="text-center font-bold" style={{ color: colors.text }}>
        {formatScoreValue(value)}
      </Text>
    </TouchableOpacity>
  );
}

const soloScoreOptions = [0, 1, 2, 3, 4, 5, 6];
const groupScoreOptions = [0, -1, -2, -3, -4, 1, 2, 3, 4, 5];

export default function ScoreCardPage() {
  const { setup, updateSoloCell, updateGroupCell, updateParValues } =
    useGameSetup();

  const [editingCell, setEditingCell] = useState<EditingCell>(null);
  const [isParModalVisible, setIsParModalVisible] = useState(false);

  const holes = setup.holes ?? 9;
  const is18 = holes === 18;

  if (!setup.playType) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white">No score card data found.</Text>
      </View>
    );
  }

  const currentParValues =
    setup.playType === 'solo'
      ? (setup.soloScoreData?.par ?? Array.from({ length: holes }, () => 4))
      : (setup.groupScoreData?.par ?? Array.from({ length: holes }, () => 4));

  const modalDisplayName = useMemo(() => {
    if (!editingCell) {
      return '';
    }

    if (editingCell.type === 'group') {
      const player = setup.groupScoreData?.players.find(
        item => item.playerId === editingCell.playerId,
      );
      return player?.playerName ?? 'Player';
    }

    return 'Player 1';
  }, [editingCell, setup.groupScoreData]);

  const modalHoleNumber = editingCell ? editingCell.index + 1 : 1;

  const currentQuickOptions =
    editingCell?.type === 'solo' ? soloScoreOptions : groupScoreOptions;

  const openSoloEditor = (row: 'on' | 'putt', index: number, value: number) => {
    setEditingCell({ type: 'solo', row, index, value });
  };

  const openGroupEditor = (playerId: string, index: number, value: number) => {
    setEditingCell({ type: 'group', playerId, index, value });
  };

  const applyQuickScore = (value: number) => {
    if (!editingCell) {
      return;
    }

    if (editingCell.type === 'solo') {
      updateSoloCell(editingCell.row, editingCell.index, value);
    } else {
      updateGroupCell(editingCell.playerId, editingCell.index, value);
    }

    setEditingCell(null);
  };

  const handleApplyParValues = (values: number[]) => {
    updateParValues(values);
    setIsParModalVisible(false);
  };

  const renderSoloTable = (
    start: number,
    end: number,
    totalLabel: 'OUT' | 'IN',
  ) => {
    const soloScoreData = setup.soloScoreData;

    if (!soloScoreData) {
      return null;
    }

    const rows: { label: string; key: 'on' | 'putt'; values: number[] }[] = [
      { label: 'ON', key: 'on', values: soloScoreData.on },
      { label: 'PUTT', key: 'putt', values: soloScoreData.putt },
    ];

    const scoreValues = soloScoreData.par.map((par, index) => {
      const on = soloScoreData.on[index] ?? 0;
      const putt = soloScoreData.putt[index] ?? 0;
      return on + putt - par;
    });

    const totalValues = soloScoreData.par.map((_, index) => {
      const on = soloScoreData.on[index] ?? 0;
      const putt = soloScoreData.putt[index] ?? 0;
      return on + putt;
    });

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View className="mb-6 overflow-hidden rounded-md border border-neutral-300 bg-white">
          <View className="flex-row bg-[#175E39]">
            <View className="w-20 border-r border-neutral-400 px-3 py-3">
              <Text className="font-bold text-white">HOLE</Text>
            </View>

            {Array.from({ length: end - start }, (_, idx) => {
              const hole = start + idx + 1;

              return (
                <View
                  key={hole}
                  className="w-12 items-center justify-center border-r border-neutral-300 px-2 py-3"
                >
                  <Text className="font-bold text-white">{hole}</Text>
                </View>
              );
            })}

            <View className="w-16 items-center justify-center bg-[#175E39] px-2 py-3">
              <Text className="font-bold text-white">{totalLabel}</Text>
            </View>
          </View>

          <View className="flex-row border-t border-neutral-300">
            <View className="w-20 border-r border-neutral-400 bg-green-100 px-3 py-3">
              <Text className="font-bold text-[#175E39]">PAR</Text>
            </View>

            {soloScoreData.par.slice(start, end).map((value, idx) => (
              <ParCell
                key={`par-${start + idx}`}
                value={value}
                onPress={() => setIsParModalVisible(true)}
              />
            ))}

            <TotalCell total={sumRange(soloScoreData.par, start, end)} />
          </View>

          {rows.map(row => (
            <View
              key={row.key}
              className="flex-row border-t border-neutral-300"
            >
              <View className="w-20 border-r border-neutral-400 bg-green-100 px-3 py-3">
                <Text className="font-bold text-[#175E39]">{row.label}</Text>
              </View>

              {row.values.slice(start, end).map((value, idx) => {
                const actualIndex = start + idx;

                return (
                  <ScoreCell
                    key={`${row.key}-${actualIndex}`}
                    value={value}
                    onPress={() => openSoloEditor(row.key, actualIndex, value)}
                  />
                );
              })}

              <TotalCell total={sumRange(row.values, start, end)} />
            </View>
          ))}

          <View className="flex-row border-t border-neutral-300">
            <View className="w-20 border-r border-neutral-400 bg-green-100 px-3 py-3">
              <Text className="font-bold text-[#175E39]">TOTAL</Text>
            </View>

            {totalValues.slice(start, end).map((value, idx) => (
              <View
                key={`total-${start + idx}`}
                className="w-12 items-center justify-center border-r border-neutral-300 px-2 py-3"
              >
                <Text className="text-center font-bold">{value}</Text>
              </View>
            ))}

            <TotalCell
              total={getTotalStrokes(
                soloScoreData.on,
                soloScoreData.putt,
                start,
                end,
              )}
            />
          </View>

          <View className="flex-row border-t border-neutral-300">
            <View className="w-20 border-r border-neutral-400 bg-green-100 px-3 py-3">
              <Text className="font-bold text-[#175E39]">SCORE</Text>
            </View>

            {scoreValues.slice(start, end).map((value, idx) => (
              <ScoreResultCell key={`score-${start + idx}`} value={value} />
            ))}

            <ScoreTotalCell
              total={getTotalScoreDiff(
                soloScoreData.par,
                soloScoreData.on,
                soloScoreData.putt,
                start,
                end,
              )}
            />
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderGroupTable = (
    start: number,
    end: number,
    totalLabel: 'OUT' | 'IN',
  ) => {
    const groupScoreData = setup.groupScoreData;

    if (!groupScoreData) {
      return null;
    }

    const parRangeTotal = sumRange(groupScoreData.par, start, end);

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View className="mb-6 overflow-hidden rounded-md border border-neutral-300 bg-white">
          <View className="flex-row bg-[#175E39]">
            <View className="w-28 border-r border-neutral-300 px-3 py-3">
              <Text className="font-bold text-white">PLAYER</Text>
            </View>

            {Array.from({ length: end - start }, (_, idx) => {
              const hole = start + idx + 1;

              return (
                <View
                  key={hole}
                  className="w-12 items-center justify-center border-r border-neutral-300 px-2 py-3"
                >
                  <Text className="font-bold text-white">{hole}</Text>
                </View>
              );
            })}

            <View className="w-16 items-center justify-center bg-[#175E39] px-2 py-3">
              <Text className="font-bold text-white">{totalLabel}</Text>
            </View>

            <View className="w-16 items-center justify-center bg-[#175E39] px-2 py-3">
              <Text className="font-bold text-white">SCORE</Text>
            </View>
          </View>

          <View className="flex-row border-t border-neutral-300">
            <View className="w-28 border-r border-neutral-400 bg-green-100 px-3 py-3">
              <Text className="font-bold text-[#175E39]">PAR</Text>
            </View>

            {groupScoreData.par.slice(start, end).map((par, idx) => (
              <ParCell
                key={`par-${start + idx}`}
                value={par}
                onPress={() => setIsParModalVisible(true)}
              />
            ))}

            <TotalCell total={parRangeTotal} />

            <View className="w-16 items-center justify-center border-r border-neutral-300 bg-green-100 px-2 py-3">
              <Text className="text-center font-bold text-[#175E39]">E</Text>
            </View>
          </View>

          {groupScoreData.players.map(player => {
            const scoreDiff = sumRange(player.scores, start, end);
            const totalStrokes = parRangeTotal + scoreDiff;

            return (
              <View
                key={player.playerId}
                className="flex-row border-t border-neutral-300"
              >
                <View className="w-28 border-r border-neutral-400 bg-green-100 px-3 py-3">
                  <Text className="font-bold text-[#175E39]">
                    {player.playerName}
                  </Text>
                </View>

                {player.scores.slice(start, end).map((score, idx) => {
                  const actualIndex = start + idx;

                  return (
                    <GroupEditableScoreCell
                      key={`${player.playerId}-${actualIndex}`}
                      value={score}
                      onPress={() =>
                        openGroupEditor(player.playerId, actualIndex, score)
                      }
                    />
                  );
                })}

                <TotalCell total={totalStrokes} />
                <ScoreTotalCell total={scoreDiff} />
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-[#f2f2f2]"
        contentContainerStyle={{ padding: 16 }}
      >
        <Text
          style={{
            fontFamily: 'PlayfairDisplay-Bold',
            fontSize: 28,
            color: '#111',
            marginBottom: 8,
          }}
        >
          Tee Score Card
        </Text>

        <Text style={{ marginBottom: 4, color: '#333' }}>
          Course: {setup.courseName}
        </Text>
        <Text style={{ marginBottom: 4, color: '#333' }}>
          Date: {setup.gameDate}
        </Text>
        <Text style={{ marginBottom: 16, color: '#333' }}>
          Players: {setup.players.length}
        </Text>

        <View className="mb-5 rounded-md border border-neutral-200 bg-white p-4">
          <Text className="mb-3 text-base font-bold text-black">
            Score Color Guide
          </Text>

          <View className="flex-row flex-wrap gap-2">
            <View className="rounded-full bg-[#0f766e] px-3 py-2">
              <Text className="text-xs font-bold text-white">
                Eagle / Albatross
              </Text>
            </View>

            <View className="rounded-full bg-[#16a34a] px-3 py-2">
              <Text className="text-xs font-bold text-white">Birdie (-1)</Text>
            </View>

            <View className="rounded-full bg-[#f3f4f6] px-3 py-2">
              <Text className="text-xs font-bold text-black">Par (0)</Text>
            </View>

            <View className="rounded-full bg-[#f59e0b] px-3 py-2">
              <Text className="text-xs font-bold text-white">Bogey (+1)</Text>
            </View>

            <View className="rounded-full bg-[#ef4444] px-3 py-2">
              <Text className="text-xs font-bold text-white">
                Double Bogey (+2)
              </Text>
            </View>

            <View className="rounded-full bg-[#7f1d1d] px-3 py-2">
              <Text className="text-xs font-bold text-white">
                Triple Bogey+
              </Text>
            </View>
          </View>
        </View>

        {setup.playType === 'solo'
          ? renderSoloTable(0, 9, 'OUT')
          : renderGroupTable(0, 9, 'OUT')}

        {is18 &&
          (setup.playType === 'solo'
            ? renderSoloTable(9, 18, 'IN')
            : renderGroupTable(9, 18, 'IN'))}
      </ScrollView>

      <ParSelectionModal
        visible={isParModalVisible}
        holes={holes}
        initialParValues={currentParValues}
        onClose={() => setIsParModalVisible(false)}
        onApply={handleApplyParValues}
      />

      <Modal visible={!!editingCell} transparent animationType="fade">
        <View className="flex-1 items-center justify-center bg-black/45 px-5">
          <View className="w-full rounded-3xl bg-white p-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-2xl font-semibold text-black">
                {modalDisplayName} {modalHoleNumber} Hole
              </Text>

              <TouchableOpacity onPress={() => setEditingCell(null)}>
                <Text className="text-3xl text-neutral-500">×</Text>
              </TouchableOpacity>
            </View>

            <Text className="mb-5 text-sm text-neutral-500">
              {editingCell?.type === 'solo'
                ? 'Select the actual stroke count.'
                : 'Select the score for this hole.'}
            </Text>

            <View className="flex-row flex-wrap justify-center gap-3">
              {currentQuickOptions.map(option => {
                const isSelected = editingCell?.value === option;

                return (
                  <TouchableOpacity
                    key={option}
                    className={`h-20 w-20 items-center justify-center rounded-2xl border ${
                      isSelected
                        ? 'border-[#d97706] bg-[#f59e0b]'
                        : 'border-neutral-300 bg-white'
                    }`}
                    onPress={() => applyQuickScore(option)}
                  >
                    <Text
                      className={`text-2xl font-semibold ${
                        isSelected ? 'text-white' : 'text-neutral-700'
                      }`}
                    >
                      {editingCell?.type === 'solo'
                        ? option
                        : formatScoreValue(option)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
